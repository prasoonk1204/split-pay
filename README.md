# Split Pay

## Project Overview
Split Pay is a modern decentralized application (dApp) built on the Stellar network using Soroban smart contracts. It allows users to easily split expenses, manage shared bills, and settle payments transparently on the blockchain.

## Features
- **Multi-Wallet Support:** Connect with Freighter, LOBSTR, Albedo, or xBull.
- **Smart Contract Integration:** Utilizes Soroban to securely record and manage shared expenses.
- **Real-time Activity Feed:** Monitor events and transactions seamlessly.
- **Atomic Settlement:** Process complex multi-node splits in a single atomic transaction.
- **Performance Optimized:** Includes event streaming deduplication and caching for a flicker-free UI.
- **Responsive Design:** Premium 3D interactive background with a fully mobile-optimized layout.

## Architecture
- **Frontend:** React, Vite, Tailwind CSS, Three.js (React Three Fiber)
- **Blockchain Integration:** Stellar SDK v15, Stellar Wallets Kit
- **Smart Contracts:** Rust (Soroban)
- **Testing:** Vitest

## Smart Contract Overview
The Split Pay smart contract handles the core logic for mapping payees, resolving balances, and executing split transactions. It ensures that funds are settled correctly according to the provided parameters without relying on off-chain trust.

## Installation
```bash
npm install
```

## Development
```bash
npm run dev
```

## Deployment
Deployment scripts for the Soroban smart contract will be available in the `scripts/` directory.
```bash
# Deploy to testnet
npm run deploy:testnet
```

## Usage
1. Connect your Stellar wallet.
2. Create a new split payment request.
3. Share with participants to collect funds.
4. Settle seamlessly on-chain.
