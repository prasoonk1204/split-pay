import {
  isConnected,
  isAllowed,
  setAllowed,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
import { Horizon, TransactionBuilder, Networks, Asset } from "@stellar/stellar-sdk";
import { signWithKit } from "./walletKit";

// Initialize Stellar SDK for Testnet
const server = new Horizon.Server("https://horizon-testnet.stellar.org");

// ── Core Phase: Freighter single-wallet connect (preserved) ──────────────────
export const connectWallet = async () => {
  try {
    const connectedStatus = await isConnected();
    if (!connectedStatus.isConnected) {
      throw new Error("Freighter is not installed or connected");
    }

    let allowedStatus = await isAllowed();
    if (!allowedStatus.isAllowed) {
      await setAllowed();
      allowedStatus = await isAllowed();
    }

    if (allowedStatus.isAllowed) {
      const addressInfo = await getAddress();
      if (addressInfo.error) {
        throw new Error(addressInfo.error);
      }
      return addressInfo.address;
    }
    return null;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

// ── Balance (shared White + Integration Phase) ─────────────────────────────────────
export const getAccountBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b) => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0.00";
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return "Unfunded Account";
    }
    throw error;
  }
};

// ── Core Phase: Freighter-signed XLM payment (preserved) ─────────────────────
export const sendPayment = async (senderPublicKey, destinationPublicKey, amount) => {
  try {
    const sourceAccount = await server.loadAccount(senderPublicKey);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: Horizon.BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Horizon.Operation.payment({
          destination: destinationPublicKey,
          asset: Asset.native(),
          amount: String(amount),
        })
      )
      .setTimeout(30)
      .build();

    const xdr = transaction.toXDR();

    const signedXdrResponse = await signTransaction(xdr, { network: "TESTNET" });

    if (signedXdrResponse.error) {
      throw new Error(signedXdrResponse.error || "Transaction signing failed");
    }

    const signedTransaction = TransactionBuilder.fromXDR(
      signedXdrResponse.signedTxXdr,
      Networks.TESTNET
    );

    const result = await server.submitTransaction(signedTransaction);
    return result;
  } catch (error) {
    console.error("Error sending payment:", error);
    throw error;
  }
};

// ── Integration Phase: re-export kit and soroban utilities ─────────────────────────
export { openKitModal, signWithKit, disconnectKit } from "./walletKit";
export { sacTransfer, fetchContractEvents, classifyError, CONTRACT_ID } from "./soroban";
