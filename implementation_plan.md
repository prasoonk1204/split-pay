# Smart Split & Pay dApp Implementation Plan

This plan outlines the steps to build the "Smart Split & Pay" dApp on the Stellar Testnet, in accordance with the provided PRD.

## Proposed Changes

We will build the application using **React (via Vite)**, initialized directly into `d:\Smart Split & Pay dApp`.

---
### Foundation & Dependencies

- **Framework**: Vite + React
- **Styling**: Tailwind CSS (as recommended in the PRD, pending version confirmation)
- **Packages**: 
  - `@stellar/freighter-api` for connecting to the Freighter extension and signing transactions.
  - `@stellar/stellar-sdk` for interacting with the Stellar Horizon API (testnet) to check balances and submit transactions.

---
### Project Structure

Following the PRD's structure, the source code will be organized modularly:

#### `src/services/stellar.js` 
Will hold encapsulating logic for all blockchain interactions:
- `connectWallet()`: Prompts Freighter connection.
- `getAccountBalance(publicKey)`: Fetches XLM balance from Horizon.
- `sendPayment(senderPubKey, destination, amount)`: Builds and signs the transaction.

#### `src/components/`
Modular UI elements designed with a clean "friend/group split" vibe:
- **`WalletConnect.jsx`**: Button handling connection and displaying the truncated address.
- **`BalanceCard.jsx`**: Visually appealing display of the available XLM.
- **`SplitPaymentForm.jsx`**: Input fields for Recipient and Amount, styled to feel like a bill-split rather than a raw crypto transfer.
- **`TransactionStatus.jsx`**: Feedback UI (Success/Error and Transaction Hash).

#### `src/pages/Home.jsx`
Will act as the main application orchestrator, importing and displaying the components, and managing the global state (connected wallet, balance, transaction progress).

---
### README Updates
A clean `README.md` will be created at the root with the required description, features, setup instructions, and placeholders for screenshots.

## Open Questions

> [!IMPORTANT]
> 1. **Which version of Tailwind CSS would you prefer to use?** (e.g., v3 or the latest v4)? If no preference, I will default to v3 since it is the most stable standard plugin setup for Vite.
> 2. **JavaScript vs TypeScript?** Would you prefer standard JavaScript (.jsx) or TypeScript (.tsx) for the components and services?

## Verification Plan

### Manual Verification
- Use the built-in Vite dev server (`npm run dev`) to manually verify the UI in the browser.
- Install Freighter extension locally on your browser.
- Verify Freighter connection flow is successful and fetches the public key.
- Verify Horizon API testnet balance fetch works.
- Verify the build transaction and signing flow works and produces a transaction hash on successful submission.
