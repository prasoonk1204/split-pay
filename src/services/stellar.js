import {
  isConnected,
  isAllowed,
  setAllowed,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";
import { Horizon, Keypair, TransactionBuilder, Networks, Asset } from "@stellar/stellar-sdk";

// Initialize Stellar SDK for Testnet
const server = new Horizon.Server("https://horizon-testnet.stellar.org");

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

export const getAccountBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b) => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0.00";
  } catch (error) {
    console.error("Error fetching balance:", error);
    if (error.response && error.response.status === 404) {
      return "Unfunded Account";
    }
    throw error;
  }
};

export const sendPayment = async (senderPublicKey, destinationPublicKey, amount) => {
  try {
    // 1. Load the sender account
    const sourceAccount = await server.loadAccount(senderPublicKey);

    // 2. Build the transaction
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

    // 3. Convert transaction to XDR string for Freighter
    const xdr = transaction.toXDR();

    // 4. Sign transaction with Freighter
    const signedXdrResponse = await signTransaction(xdr, {
      network: "TESTNET",
    });

    if (signedXdrResponse.error) {
      throw new Error(signedXdrResponse.error || "Transaction signing failed");
    }

    // 5. Build signed transaction from XDR
    const signedTransaction = TransactionBuilder.fromXDR(signedXdrResponse.signedTxXdr, Networks.TESTNET);

    // 6. Submit the transaction to the Stellar Testnet
    const result = await server.submitTransaction(signedTransaction);
    return result;
  } catch (error) {
    console.error("Error sending payment:", error);
    throw error;
  }
};
