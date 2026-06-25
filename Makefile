.PHONY: all build optimize test deploy clean

all: build optimize test

build:
	@echo "Building Soroban contract..."
	cd contracts/split_contract && cargo build --target wasm32-unknown-unknown --release

optimize:
	@echo "Optimizing WASM..."
	stellar contract optimize --wasm contracts/split_contract/target/wasm32-unknown-unknown/release/smart_split_contract.wasm

test:
	@echo "Running contract tests..."
	cd contracts/split_contract && cargo test

deploy: optimize
	@echo "Deploying contract to Testnet..."
	bash scripts/deploy.sh

clean:
	@echo "Cleaning build artifacts..."
	cd contracts/split_contract && cargo clean
