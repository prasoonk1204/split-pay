#!/bin/bash
# scripts/deploy.sh
# Deployment workflow for Split Pay smart contract

echo "🚀 Starting Soroban contract deployment to Testnet..."

# Ensure we have the identity
if ! soroban config identity ls | grep -q "deployer"; then
    echo "Creating new identity 'deployer'..."
    soroban config identity generate --network testnet deployer
fi

# Deploy the optimized contract
echo "Deploying WASM to testnet..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm contracts/split_contract/target/wasm32-unknown-unknown/release/split_contract.wasm \
  --source deployer \
  --network testnet)

echo "✅ Deployment successful!"
echo "Contract ID: $CONTRACT_ID"
echo "Make sure to update your frontend environment variables with this Contract ID."
