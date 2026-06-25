#!/bin/bash
# scripts/deploy.sh
# Deployment workflow for Split Pay smart contract

echo "🚀 Starting Soroban contract deployment to Testnet..."

# Ensure we have the identity
if ! stellar keys ls | grep -q "deployer"; then
    echo "Creating new identity 'deployer'..."
    stellar keys generate deployer
fi

# Deploy the optimized contract
echo "Deploying WASM to testnet..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm contracts/split_contract/target/wasm32-unknown-unknown/release/smart_split_contract.optimized.wasm \
  --source deployer \
  --network testnet)

echo "✅ Deployment successful!"
echo "Contract ID: $CONTRACT_ID"
echo "Make sure to update your frontend environment variables with this Contract ID."
