# Split Pay

## Project Overview
Split Pay is a comprehensive, production-ready decentralized application (dApp) built on the Stellar network using Soroban smart contracts. It allows users to easily split expenses, manage shared bills, and settle payments transparently on the blockchain. This project acts as an end-to-end implementation of advanced Stellar development patterns on the testnet.

## Core Features & Functionality

### 1. Wallet Integration & Balance Handling
- **Multi-Wallet Support:** Users can securely connect via Freighter, LOBSTR, Albedo, or xBull using StellarWalletsKit.
- **Real-time Balance:** Seamlessly fetches and displays the connected wallet's XLM testnet balance.
- **Wallet Connection State:** Clear UI states for disconnected, connecting, and connected scenarios.

### 2. Smart Contract Operations
- **Soroban Integration:** Utilizes advanced, optimized Rust smart contracts deployed on the Soroban testnet.
- **Transaction Flow:** End-to-end execution of XLM transactions with multi-node atomic split logic.
- **Inter-Contract Communication:** Contract routes split calls through a secondary proxy layer to demonstrate secure contract-to-contract message passing.
- **Transaction Tracking:** Provides clear, real-time transaction feedback (success/fail/pending) along with on-chain hashes.

### 3. Real-Time Data & Event Streaming
- **Live Activity Feed:** Listens to contract events and syncs the UI state in real-time.
- **Event Deduplication:** Implements intelligent caching to prevent UI flickering during continuous polling.

### 4. Robust Error Handling
Explicit handling and classification for critical edge cases:
1. **Wallet Not Found:** Prompts to install Freighter/compatible wallet.
2. **User Rejected:** Detects when a user declines a signature request.
3. **Insufficient Balance:** Catches underfunded accounts before attempting network submissions.

### 5. Production-Ready Architecture
- **Mobile Responsive Frontend:** Adaptive layouts for smartphone dimensions (Tailwind CSS, React).
- **Automated CI/CD Pipeline:** Fully integrated GitHub Actions workflow for building and testing both the React frontend and the Rust smart contracts.
- **Testing Infrastructure:** Vitest suite covering UI components and Soroban state generation, paired with native Rust unit tests for the smart contract layer.
- **Deployment Workflow:** Streamlined `Makefile` and bash scripts to optimize and deploy WASM binaries reliably.

---

## 📌 Important Links & Verifications

- **Live Demo Link:** [Link]
- **Demo Video:** [demo-video.mp4](./demo-video.mp4)

- **Deployed Contract Address:** `CB5O5ZTTE4OS7R3KLQVUOV7MVN5SA5DJSMHEUZYJ6YCNE3NLPBPAEJQH`
- **Contract Interaction Hash:** `f1ca8ee3a2854935e28586d27ed0eb86b98077c0c1f39e59dfb163a0e5f43c6d`

### Screenshots
- **Wallet Options:** ![Wallet Options](screenshots/wallet-options.png)
- **Wallet Connected & Balance:** ![Wallet Connected](screenshots/dashboard.png)
- **Mobile Responsive UI:** ![Mobile UI](screenshots/mobile-ui.png)
- **Successful Testnet Transaction:** ![Testnet Transaction](screenshots/testnet-transaction.png)
- **Automated Test Output (3+ Passing):** ![Test Output](screenshots/test-output.png)
- **CI/CD Pipeline Running:** ![CI/CD Status](screenshots/ci-cd.png)

---

## 🤖 Automated CI/CD Pipelines

This repository is equipped with fully integrated **GitHub Actions** workflows to automate build validation, testing, code quality checks, and dependency security checks:

1. **Continuous Integration ([ci.yml](file:///.github/workflows/ci.yml)):**
   * Triggered on every push and pull request to the `main` branch.
   * Compiles the Rust smart contract (`make build`), runs contract tests (`make test`), runs the frontend Vitest suite (`npm run test`), and builds the production site.
2. **Code Quality & Linting ([lint.yml](file:///.github/workflows/lint.yml)):**
   * Triggered on every push and pull request to `main`.
   * Enforces frontend code standards (`npm run lint`), checks Rust formatting (`cargo fmt`), and runs cargo clippy checks.
3. **Dependency Security Audit ([audit.yml](file:///.github/workflows/audit.yml)):**
   * Triggered on pushes, PRs, and runs automatically every Sunday.
   * Scans frontend packages for high-severity vulnerabilities (`npm audit`) and audits Rust dependencies (`cargo audit`) using the official RustSec action.

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run frontend tests
npm run test
```

## Smart Contract Development

```bash
# Build and optimize the contract
make build
make optimize

# Run Rust contract tests
make test

# Deploy to Testnet
make deploy
```
