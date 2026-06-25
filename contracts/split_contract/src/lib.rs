#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, IntoVal};

#[contract]
pub struct SmartSplitContract;

#[contractimpl]
impl SmartSplitContract {
    /// Executes an atomic split route.
    pub fn execute_split(env: Env, token: Address, from: Address, to: Address, amount: i128) {
        // Enforce cryptographic authorization from the sender's wallet
        from.require_auth();

        // Bind directly to the specified token contract (e.g. XLM SAC)
        let token_client = soroban_sdk::token::Client::new(&env, &token);
        
        // Execute the transfer
        token_client.transfer(&from, &to, &amount);

        // Publish a Soroban event for the split
        env.events().publish(
            (soroban_sdk::symbol_short!("split"), from, to),
            amount
        );
    }

    /// Demonstrates inter-contract communication by routing a split through a secondary contract.
    pub fn route_split(env: Env, proxy_contract: Address, token: Address, from: Address, to: Address, amount: i128) {
        from.require_auth();
        // Invoke the secondary proxy contract using inter-contract communication
        env.invoke_contract::<()>(&proxy_contract, &soroban_sdk::Symbol::new(&env, "proxy_transfer"), soroban_sdk::vec![&env, token.into_val(&env), from.into_val(&env), to.into_val(&env), amount.into_val(&env)]);
    }
}

mod test;
