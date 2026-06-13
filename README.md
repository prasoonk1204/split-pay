# Smart Split & Pay dApp

## Description
A Stellar testnet dApp designed for students and friends to easily connect their wallets, check balances, and split bills using XLM. 

By framing transactions around "friend/group vibes" and bill splitting, it bridges the gap between raw crypto transfers and everyday utility.

## Features
- **Wallet connect**: Easy integration with Freighter extension.
- **Balance display**: Fetch LIVE testnet XLM balance using the Stellar Horizon API.
- **Send XLM (Split Payment)**: Invite a friend and send them an exact share of the payment.
- **Transaction feedback**: Real-time status indicators (Success, Error) and trackable transaction hashes.

## Setup
### Prerequisites
- Node.js (v18+)
- [Freighter Wallet Extension](https://www.freighter.app/)

### Installation & Execution
```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

## Screenshots
*(Images to be added before final submission)*
- Wallet connected display
- Balance visible via BalanceCard
- Transaction success feedback
- Transaction hash link to explorer

## Future Scope (Level 2+)
- **Split bill system**: Complex arithmetic for splitting exact costs manually.
- **Group creation**: Allow the creation of shared vaults via Smart Contracts (Soroban).
- **History tracking**: View past split payments.

---
> *Tip: Ensure your Freighter wallet is set to **Testnet** and funded via the Stellar laboratory friendly bot before making transactions!*
