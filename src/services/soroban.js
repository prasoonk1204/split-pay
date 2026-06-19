/**
 * soroban.js — Soroban RPC interactions
 * Integration Phase: contract calls, events, error classification
 *
 * Uses the Stellar Native Asset Contract (SAC) — already live on testnet.
 * Contract ID: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
 *
 * NOTE: In @stellar/stellar-sdk v15, SorobanRpc was renamed to `rpc` (lowercase).
 */
import {
  rpc,
  TransactionBuilder,
  Networks,
  Contract,
  nativeToScVal,
  Address,
  scValToNative,
} from '@stellar/stellar-sdk';
import { signWithKit } from './walletKit';

export const CONTRACT_ID =
  import.meta.env.VITE_CONTRACT_ID ||
  'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

const sorobanServer = new rpc.Server(
  'https://soroban-testnet.stellar.org',
  { allowHttp: false }
);

// ─── ERROR CLASSIFIER ────────────────────────────────────────────────────────

export const classifyError = (error) => {
  const msg = (error?.message || '').toLowerCase();
  const extras = JSON.stringify(error?.response?.data || '').toLowerCase();

  // 1. Wallet not found / not installed
  if (
    msg.includes('user_closed') ||
    msg.includes('not installed') ||
    msg.includes('not connected') ||
    msg.includes('freighter') ||
    msg.includes('no wallet') ||
    msg.includes('extension')
  ) {
    return {
      type: 'wallet_not_found',
      message: '🔌 No Wallet Found — Install Freighter from freighter.app to continue.',
    };
  }

  // 2. User rejected / cancelled
  if (
    msg.includes('reject') ||
    msg.includes('cancel') ||
    msg.includes('denied') ||
    msg.includes('declined') ||
    msg.includes('closed')
  ) {
    return {
      type: 'user_rejected',
      message: '🚫 Transaction Cancelled — You declined the signing request. No funds were moved.',
    };
  }

  // 3. Insufficient balance
  if (
    msg.includes('insufficient') ||
    msg.includes('underfunded') ||
    extras.includes('op_underfunded') ||
    extras.includes('insufficient_balance')
  ) {
    return {
      type: 'insufficient_balance',
      message: '💸 Insufficient Balance — Your XLM balance is too low. Fund your account at laboratory.stellar.org.',
    };
  }

  // 4. Generic fallback
  return {
    type: 'generic',
    message: error?.message || 'An unexpected error occurred. Please try again.',
  };
};

// ─── CONTRACT CALL (simulate → sign → submit → poll) ─────────────────────────

export const callContract = async (publicKey, fnName, args = []) => {
  const account = await sorobanServer.getAccount(publicKey);
  const contract = new Contract(CONTRACT_ID);

  const tx = new TransactionBuilder(account, {
    fee: '1000000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call(fnName, ...args))
    .setTimeout(30)
    .build();

  // Simulate first
  const simResult = await sorobanServer.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  const preparedTx = rpc.assembleTransaction(tx, simResult).build();
  const signedXdr = await signWithKit(preparedTx.toXDR());
  const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

  const sendResult = await sorobanServer.sendTransaction(signedTx);
  if (sendResult.status === 'ERROR') {
    throw new Error(`Submission error: ${JSON.stringify(sendResult.errorResultXdr)}`);
  }

  // Poll for confirmation (up to 15 attempts × 2s = 30s)
  let getResult;
  let attempts = 0;
  do {
    await new Promise((r) => setTimeout(r, 2000));
    getResult = await sorobanServer.getTransaction(sendResult.hash);
    attempts++;
  } while (
    getResult.status === rpc.Api.GetTransactionStatus.NOT_FOUND &&
    attempts < 15
  );

  if (getResult.status === rpc.Api.GetTransactionStatus.SUCCESS) {
    const returnVal = getResult.returnValue ? scValToNative(getResult.returnValue) : null;
    return { hash: sendResult.hash, result: returnVal };
  }

  throw new Error(`Transaction failed with status: ${getResult.status}`);
};

// ─── SAC TRANSFER ─────────────────────────────────────────────────────────────

/**
 * Transfer XLM via the Soroban Native Asset Contract (SAC).
 * This is the Integration Phase "contract called from frontend" proof.
 */
export const sacTransfer = async (senderPublicKey, recipientPublicKeys, amountXlmSplit) => {
  const amountStroops = BigInt(Math.round(parseFloat(amountXlmSplit) * 1e7));

  let lastHash = null;

  for (const recipient of recipientPublicKeys) {
    const args = [
      nativeToScVal(Address.fromString(senderPublicKey), { type: 'address' }),
      nativeToScVal(Address.fromString(recipient), { type: 'address' }),
      nativeToScVal(amountStroops, { type: 'i128' }),
    ];
    const res = await callContract(senderPublicKey, 'transfer', args);
    lastHash = res.hash;
  }

  return { hash: lastHash };
};

// ─── EVENTS ──────────────────────────────────────────────────────────────────

export const fetchContractEvents = async () => {
  try {
    const latest = await sorobanServer.getLatestLedger();
    const startLedger = Math.max(1, latest.sequence - 5000);

    const response = await sorobanServer.getEvents({
      startLedger,
      filters: [{ type: 'contract', contractIds: [CONTRACT_ID] }],
      limit: 20,
    });

    return (response.events || []).map((ev) => ({
      id: ev.id,
      ledger: ev.ledger,
      topics: ev.topic.map((t) => {
        try { return scValToNative(t); } catch { return String(t); }
      }),
      value: (() => {
        try { return scValToNative(ev.value); } catch { return null; }
      })(),
      timestamp: new Date(ev.ledgerClosedAt || Date.now()).toLocaleTimeString(),
    }));
  } catch {
    return [];
  }
};
