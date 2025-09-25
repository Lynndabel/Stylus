//!
//! Buy Me A Coffee Factory Contract System
//!
//! Factory pattern that allows multiple creators to have their own tip jars
//! within a single smart contract system.
//!

#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
#![cfg_attr(not(any(test, feature = "export-abi")), no_std)]

#[macro_use]
extern crate alloc;

use alloc::vec::Vec;
use alloc::string::String;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    alloy_sol_types::sol,
    call::transfer_eth,
    msg,
    prelude::*,
};

// Define the main factory storage
sol_storage! {
    pub struct CoffeeFactory {
        // Map creator address to their accumulated tips
        mapping(address => uint256) creator_balances;
        
        // Map creator to their profile info
        mapping(address => CreatorProfile) creator_profiles;
        
        // Track all registered creators
        address[] registered_creators;
        
        // Factory owner (for platform fees, if desired)
        address factory_owner;
        
        // Platform fee percentage (e.g., 250 = 2.5%)
        uint256 platform_fee_basis_points;
        
        // Address receiving platform fees
        address fee_recipient;
        
        // Total platform fees accrued (in wei)
        uint256 platform_fees_accrued;
    }
    
    pub struct CreatorProfile {
        string name;
        string bio;
        string avatar_url;
        bool is_active;
        uint256 total_tips_received;
        uint256 tip_count;
    }
}

sol! {
    // Events
    event TipSent(
        address indexed supporter,
        address indexed creator, 
        uint256 amount,
        string message
    );
    
    event CreatorRegistered(
        address indexed creator,
        string name
    );
    
    event TipsWithdrawn(
        address indexed creator,
        uint256 amount,
        uint256 platform_fee
    );
    
    event CreatorProfileUpdated(
        address indexed creator
    );

    event PlatformFeeUpdated(
        uint256 oldFeeBps,
        uint256 newFeeBps
    );

    event FeeRecipientUpdated(
        address oldRecipient,
        address newRecipient
    );

    event PlatformFeeAccrued(
        address indexed supporter,
        address indexed creator,
        uint256 feeAmount
    );
}

#[public]
impl CoffeeFactory {
    
    /// Initialize the factory
    pub fn constructor(&mut self, platform_fee_bp: U256) {
        self.factory_owner.set(msg::sender());
        self.platform_fee_basis_points.set(platform_fee_bp); // e.g., 250 = 2.5%
        // default fee recipient to deployer/owner
        self.fee_recipient.set(msg::sender());
    }

    /// Register as a creator (free)
    pub fn register_creator(
        &mut self, 
        name: String, 
        bio: String, 
        avatar_url: String
    ) -> Result<(), Vec<u8>> {
        let creator = msg::sender();
        
        // Check if already registered
        let profile = self.creator_profiles.get(creator);
        if profile.is_active {
            return Err("Creator already registered".as_bytes().to_vec());
        }
        
        // Create new profile
        let new_profile = CreatorProfile {
            name: name.clone(),
            bio,
            avatar_url,
            is_active: true,
            total_tips_received: U256::ZERO,
            tip_count: U256::ZERO,
        };
        
        // Store profile and add to registered list
        self.creator_profiles.setter(creator).set(new_profile);
        self.registered_creators.push(creator);
        
        // Emit event
        evm::log(CreatorRegistered {
            creator,
            name,
        });
        
        Ok(())
    }

    /// Send tip to a specific creator
    #[payable]
    pub fn tip_creator(
        &mut self, 
        creator: Address, 
        message: String
    ) -> Result<(), Vec<u8>> {
        let supporter = msg::sender();
        let amount = msg::value();
        
        // Validate tip amount
        if amount == U256::ZERO {
            return Err("Must send ETH to tip".as_bytes().to_vec());
        }
        
        // Check if creator exists and is active
        let mut profile = self.creator_profiles.get(creator);
        if !profile.is_active {
            return Err("Creator not found or inactive".as_bytes().to_vec());
        }
        
        // Calculate platform fee
        let platform_fee = (amount * self.platform_fee_basis_points.get()) / U256::from(10000u32);
        let creator_amount = amount - platform_fee;
        
        // Accrue platform fee in storage for transparent accounting
        let accrued = self.platform_fees_accrued.get();
        self.platform_fees_accrued.set(accrued + platform_fee);

        // Update creator balance and stats
        let current_balance = self.creator_balances.get(creator);
        self.creator_balances.setter(creator).set(current_balance + creator_amount);
        
        // Update profile stats
        profile.total_tips_received += amount;
        profile.tip_count += U256::from(1u32);
        self.creator_profiles.setter(creator).set(profile);
        
        // Emit event
        evm::log(TipSent {
            supporter,
            creator,
            amount,
            message,
        });
        evm::log(PlatformFeeAccrued {
            supporter,
            creator,
            feeAmount: platform_fee,
        });
        
        Ok(())
    }

    /// Creator withdraws their accumulated tips
    pub fn withdraw_my_tips(&mut self) -> Result<(), Vec<u8>> {
        let creator = msg::sender();
        let balance = self.creator_balances.get(creator);
        
        if balance == U256::ZERO {
            return Err("No tips to withdraw".as_bytes().to_vec());
        }
        
        // Reset creator balance
        self.creator_balances.setter(creator).set(U256::ZERO);
        
        // Calculate any platform fees to be paid
        let platform_fee = U256::ZERO; // Fees already deducted during tipping
        
        // Transfer to creator
        transfer_eth(creator, balance).map_err(|e| {
            format!("Transfer failed: {:?}", e).as_bytes().to_vec()
        })?;
        
        // Emit event
        evm::log(TipsWithdrawn {
            creator,
            amount: balance,
            platform_fee,
        });
        
        Ok(())
    }

    /// Update creator profile
    pub fn update_profile(
        &mut self,
        name: String,
        bio: String,
        avatar_url: String
    ) -> Result<(), Vec<u8>> {
        let creator = msg::sender();
        let mut profile = self.creator_profiles.get(creator);
        
        if !profile.is_active {
            return Err("Creator not registered".as_bytes().to_vec());
        }
        
        // Update profile
        profile.name = name;
        profile.bio = bio;
        profile.avatar_url = avatar_url;
        self.creator_profiles.setter(creator).set(profile);
        
        evm::log(CreatorProfileUpdated { creator });
        
        Ok(())
    }

    /// Get creator's current tip balance
    pub fn get_creator_balance(&self, creator: Address) -> U256 {
        self.creator_balances.get(creator)
    }

    /// Get creator profile
    pub fn get_creator_profile(&self, creator: Address) -> CreatorProfile {
        self.creator_profiles.get(creator)
    }

    /// Get all registered creators
    pub fn get_registered_creators(&self) -> Vec<Address> {
        let mut creators = Vec::new();
        let length = self.registered_creators.len();
        
        for i in 0..length {
            creators.push(self.registered_creators.get(i).unwrap_or_default());
        }
        
        creators
    }

    /// Get platform fee percentage
    pub fn get_platform_fee(&self) -> U256 {
        self.platform_fee_basis_points.get()
    }

    /// Get the current fee recipient address
    pub fn get_fee_recipient(&self) -> Address {
        self.fee_recipient.get()
    }

    /// Get total accrued platform fees (in wei)
    pub fn get_platform_fees_accrued(&self) -> U256 {
        self.platform_fees_accrued.get()
    }

    /// Factory owner functions
    pub fn withdraw_platform_fees(&mut self) -> Result<(), Vec<u8>> {
        let caller = msg::sender();
        let factory_owner = self.factory_owner.get();
        
        if caller != factory_owner {
            return Err("Only factory owner can withdraw platform fees".as_bytes().to_vec());
        }
        
        let fees = self.platform_fees_accrued.get();
        if fees == U256::ZERO {
            return Ok(());
        }
        let recipient = self.fee_recipient.get();
        transfer_eth(recipient, fees).map_err(|e| {
            format!("Transfer failed: {:?}", e).as_bytes().to_vec()
        })?;
        // reset accrued after successful transfer
        self.platform_fees_accrued.set(U256::ZERO);
        
        Ok(())
    }

    /// Owner-only: set new platform fee basis points (max 500 bps = 5%)
    pub fn set_platform_fee_basis_points(&mut self, new_bps: U256) -> Result<(), Vec<u8>> {
        let caller = msg::sender();
        if caller != self.factory_owner.get() {
            return Err("Only factory owner can set platform fee".as_bytes().to_vec());
        }
        let max_bps = U256::from(500u32);
        if new_bps > max_bps {
            return Err("Fee too high".as_bytes().to_vec());
        }
        let old = self.platform_fee_basis_points.get();
        self.platform_fee_basis_points.set(new_bps);
        evm::log(PlatformFeeUpdated { oldFeeBps: old, newFeeBps: new_bps });
        Ok(())
    }

    /// Owner-only: update fee recipient address
    pub fn set_fee_recipient(&mut self, new_recipient: Address) -> Result<(), Vec<u8>> {
        let caller = msg::sender();
        if caller != self.factory_owner.get() {
            return Err("Only factory owner can set fee recipient".as_bytes().to_vec());
        }
        let old = self.fee_recipient.get();
        self.fee_recipient.set(new_recipient);
        evm::log(FeeRecipientUpdated { oldRecipient: old, newRecipient: new_recipient });
        Ok(())
    }

    /// Helper: Calculate total of all creator balances
    fn get_total_creator_balances(&self) -> U256 {
        let mut total = U256::ZERO;
        let creators = self.get_registered_creators();
        
        for creator in creators {
            total += self.creator_balances.get(creator);
        }
        
        total
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_factory_system() {
        let mut factory = CoffeeFactory::default();
        
        // Initialize factory with 2.5% platform fee
        factory.constructor(U256::from(250u32));
        
        // Test creator registration
        let creator_name = String::from("Alice Creator");
        let bio = String::from("Content creator and developer");
        let avatar = String::from("https://example.com/avatar.jpg");
        
        let result = factory.register_creator(creator_name, bio, avatar);
        assert!(result.is_ok());
        
        // Test getting creator profile
        let profile = factory.get_creator_profile(msg::sender());
        assert!(profile.is_active);
        assert_eq!(profile.name, "Alice Creator");
    }
}