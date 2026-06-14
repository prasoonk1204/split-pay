# Smart Split & Pay — Stellar dApp

<div align="center">

**Split bills instantly. Send XLM to friends. Live on-chain.**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-smart--split--ebon.vercel.app-00d4ff?style=for-the-badge)](https://smart-split-ebon.vercel.app/)
[![Stellar](https://img.shields.io/badge/Network-Stellar%20Testnet-7c3aed?style=flat-square)](https://stellar.org)
[![React](https://img.shields.io/badge/Frontend-React%20+%20Vite-61dafb?style=flat-square)](https://react.dev)

</div>

---

## Project Description

**Smart Split & Pay** is a Web3 bill-splitting dApp built on the **Stellar Testnet**. It lets friends connect their Freighter wallets, check live XLM balances, and split bills by sending on-chain payments — no middlemen, no delay.

The app is built with React + Vite, styled with Tailwind CSS and glassmorphism, and features a cinematic **Interstellar-themed 3D background** powered by Three.js (star field, wormhole ring, ringed planet, data crystals).

### What it does

| Feature | Description |
|---|---|
| 🔗 **Wallet Connect / Disconnect** | One-click Freighter integration with live status indicator |
| 💰 **Live XLM Balance** | Fetched in real-time from the Stellar Horizon API |
| ✈️ **Send XLM** | Enter a recipient address + amount and send on testnet |
| 📡 **Transaction Feedback** | Success state with transaction hash, error state with message |
| 🛸 **Freighter Guard** | Auto-detects if extension is missing and shows install guide |
| 🌌 **3D Space UI** | Interstellar scene: 1,800-star field, wormhole ring, ringed planet |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               React Frontend (Vite)                   │  │
│  │                                                       │  │
│  │  Background3D.jsx          App.jsx (Root State)       │  │
│  │  ├─ Star field (1800pts)   ├─ publicKey               │  │
│  │  ├─ Wormhole ring          ├─ balance                 │  │
│  │  ├─ Ringed planet          ├─ txStatus / txHash       │  │
│  │  └─ Data crystals          └─ txError                 │  │
│  │                                                       │  │
│  │  FreighterNotice.jsx       WalletConnect.jsx          │  │
│  │  └─ Extension missing      BalanceCard.jsx            │  │
│  │     toast popup            SplitPaymentForm.jsx       │  │
│  │                            TransactionStatus.jsx      │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                                │
└─────────────────────────────┼────────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
 ┌─────────▼──────────┐             ┌────────────▼──────────┐
 │ Freighter Extension│             │  Stellar Horizon API  │
 │  (Browser Wallet)  │             │  horizon-testnet      │
 │                    │             │  .stellar.org         │
 │  isConnected()     │             │  loadAccount()        │
 │  getAddress()      │             │  submitTransaction()  │
 │  signTransaction() │             └────────────┬──────────┘
 └─────────┬──────────┘                          │
           └──────────────────┬──────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │   Stellar Testnet   │
                   │  XLM · TESTNET      │
                   │  Signed & submitted │
                   └────────────────────┘
```

### Transaction Flow

```
User fills form
      │
      ▼
SplitPaymentForm → onSend(recipient, amount)
      │
      ▼
stellar.js → sendPayment()
      ├── Horizon: loadAccount(sender)     fetch sequence no.
      ├── TransactionBuilder
      │     .addOperation(Payment)         native XLM
      │     .setTimeout(30)
      │     .build()  →  .toXDR()
      │
      ├── Freighter: signTransaction(xdr, 'TESTNET')
      │         └── user approves popup
      │
      └── server.submitTransaction(signedTx)
                └── Stellar Testnet Ledger
                        │
              ┌─────────┴─────────┐
              ✅ hash + link       ❌ error message
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + CSS custom properties |
| 3D Graphics | Three.js + `@react-three/fiber` |
| Wallet | Freighter + `@stellar/freighter-api` |
| Blockchain | `@stellar/stellar-sdk` · Stellar Testnet Horizon API |
| Fonts | Inter + Space Grotesk (Google Fonts) |
| Deployment | Vercel |

---

## Setup

### Prerequisites

- **Node.js** v18+
- **[Freighter Wallet](https://www.freighter.app/)** browser extension
  - After installing: Settings → Network → **Testnet**
  - Fund your account: [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test)

### Run Locally

```bash
git clone https://github.com/pratickdutta/Smart-Split-Pay-dApp.git
cd Smart-Split-Pay-dApp
npm install
npm run dev
```

Live deployment → **[smart-split-ebon.vercel.app](https://smart-split-ebon.vercel.app/)**

---

## Core Phase Requirements

> This project fulfills all **Level 1 – Core Phase** requirements of the Stellar developer program.

### ✅ 1. Wallet Setup
- Uses **Freighter** browser extension wallet
- Configured for **Stellar Testnet** — `Networks.TESTNET` passphrase used in all transactions

### ✅ 2. Wallet Connection
- **Connect**: `connectWallet()` in `stellar.js` calls `isConnected()`, `isAllowed()`, `setAllowed()`, `getAddress()` from `@stellar/freighter-api`
- **Disconnect**: Clears `publicKey`, `balance`, and `txStatus` from React state
- Connection status is displayed live in the UI with a pulsing indicator

### ✅ 3. Balance Handling
- `getAccountBalance(publicKey)` calls `server.loadAccount()` via Stellar Horizon API
- Filters the `native` asset balance from the account's balance array
- Displayed prominently in `BalanceCard.jsx` with "TOTAL BALANCE · XLM" label

### ✅ 4. Transaction Flow
- `sendPayment()` in `stellar.js` builds, signs via Freighter, and submits a native XLM payment
- `TransactionStatus.jsx` shows:
  - ✅ **Success** — green card with the transaction hash linked to [Stellar Expert Explorer](https://stellar.expert/explorer/testnet)
  - ❌ **Error** — red card with the error message

### ✅ 5. Development Standards
- Modular component architecture (`WalletConnect`, `BalanceCard`, `SplitPaymentForm`, `TransactionStatus`)
- Full error handling in `stellar.js` with `try/catch` blocks
- Auto-detects missing Freighter extension and guides user to install it
- Clean UI with loading states on the Connect button and Send button

---

## Screenshots

### Landing Page — Wallet Disconnected

![Landing Page](screenshots/01-landing-disconnected.png)

---

### Wallet Connecting State

![Wallet Connecting](screenshots/02-wallet-connecting.png)

---

### Wallet Connected + Balance Displayed

Wallet address shown with live XLM balance fetched from Stellar Horizon API. Split & Pay form is revealed below.

![Wallet Connected & Balance](screenshots/04-wallet-connected-balance.png)

---

### Full UI — Interstellar Space Theme

Complete view with 3D background (wormhole ring, ringed planet, star field) and all interface components.

![Full App View](screenshots/03-interstellar-theme.png)

---

## Future Scope

- **Group vaults** — Shared on-chain pools via Soroban smart contracts
- **Bill splitting math** — Split a total equally across N friends
- **Transaction history** — View all past payments on-chain
- **Mainnet mode** — Production deployment with real XLM

---

> ⚠️ **Testnet only.** No real value is transferred. Always verify Freighter is set to **Testnet** before use.
