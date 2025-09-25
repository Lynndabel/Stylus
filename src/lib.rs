//!
//! Stylus Hello World
//!
//! The following contract implements the Counter example from Foundry.
//!
//! ```solidity
//! contract Counter {
//!     uint256 public number;
//!     function setNumber(uint256 newNumber) public {
//!         number = newNumber;
//!     }
//!     function increment() public {
//!         number++;
//!     }
//! }
//! ```
//!
//! The program is ABI-equivalent with Solidity, which means you can call it from both Solidity and Rust.
//! To do this, run `cargo stylus export-abi`.
//!
//! Note: this code is a template-only and has not been audited.
//!
// Allow `cargo stylus export-abi` to generate a main function.
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]

#[macro_use]
extern crate alloc;

use alloc::vec::Vec;


/// Import items from the SDK. The prelude contains common traits and macros.
 use stylus_sdk::{ alloy_sol_types::sol, prelude::*};


// Define some persistent storage using the Solidity ABI.
// `Counter` will be the entrypoint.
sol_storage! {
    pub struct BuyMeACoffee {
        // uint256 number;
        address owner;

    }
}

sol! {
    event Log(address indexed sender, string message);
    event Withdraw(address indexed to, uint256 amount);

    event AnotherLog();
}

/// Declare that `BuyMeACoffee` is a contract with the following external methods.
#[public]
impl BuyMeACoffee {

    pub fn constructor(&mut self) {
         let owner = self.vm().tx_origin();
        self.owner.setter().set(owner);
    }

    pub fn buy_coffee(&mut self, message: String) {
        Log::emit(self.vm().msg_sender(), message);
    }

       #[payable]
    pub fn buy_coffee(&mut self, new_message: String) -> Result<(), Vec<u8>> {
        let value = msg::value();
        // require value > 0
        if value == U256::from(0u64) {
            // Return an error encoded as bytes (convention in Stylus examples)
            return Err("Must send ETH to buy a coffee".as_bytes().to_vec());
        }

        // Emit event (ABI-compatible)
        evm::log(Log {
            from: msg::sender(),
            message,
        });

        Ok(())
    }


     pub fn withdraw_tips(&mut self) -> Result<(), Vec<u8>> {
        let caller = msg::sender();
        let owner = self.owner.get();

        if caller != owner {
            return Err("Only owner can withdraw".as_bytes().to_vec());
        }

        // Get contract balance
        let balance = evm::balance(evm::address()); // returns U256

        if balance == U256::from(0u64) {
            return Err("No funds to withdraw".as_bytes().to_vec());
        }

        // transfer_eth returns a Result<(), E>
        transfer_eth(owner, balance).map_err(|e| {
            // map error to bytes for simple error signalling
            format!("transfer failed: {:?}", e).as_bytes().to_vec()
        })?;

        // Optionally emit a simple EVM log (not required)
        evm::log(Withdraw { to: owner, amount: balance });

        Ok(())
    }


       pub fn get_owner(&self) -> Address {
        self.owner.get()
    }




}

#[cfg(test)]
mod test {
    use super::*;
    use stylus_sdk::test_utils::{self, *};

    #[test]
    fn test_buy_me_a_coffee() {
        let mut contract = BuyMeACoffee::deploy();

        // Simulate constructor call
        contract.constructor();

        // Check owner is set correctly
        let owner = contract.get_owner();
        assert_eq!(owner, test_utils::DEFAULT_TX_ORIGIN);

        // Simulate buying a coffee with a message and some value
        let message = "Great work!";
        let value = U256::from(1_000_000_000_000_000u64); // 0.001 ETH

        // Set up the call context
        let mut call_context = CallContext::default();
        call_context.value = value;
        call_context.sender = Address::from_low_u64_be(0xBEEF); // Some other address

        // Call buy_coffee
        contract.with_context(call_context).buy_coffee(message.to_string()).expect("buy_coffee failed");

        // Attempt to withdraw as non-owner should fail
        let withdraw_result = contract.with_context(CallContext {
            sender: Address::from_low_u64_be(0xBEEF),
            ..Default::default()
        }).withdraw_tips();
        assert!(withdraw_result.is_err(), "Non-owner should not be able to withdraw");

        // Withdraw as owner should succeed
        let withdraw_result = contract.with_context(CallContext {
            sender: owner,
            ..Default::default()
        }).withdraw_tips();
        assert!(withdraw_result.is_ok(), "Owner should be able to withdraw");
    }
}
