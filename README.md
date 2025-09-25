# ☕ Gyfted

**Decentralized Creator Support Platform - Powered by Stylus**

Gyfted is a revolutionary Web3 platform that enables creators to receive cryptocurrency tips from their supporters through a unified, gas-efficient smart contract system. Built on Arbitrum using the Stylus SDK, Gyfted provides a seamless tipping experience for content creators, developers, artists, and anyone building in the digital space.

## 🌟 Features

### For Creators
- **🆓 Free Registration** - No contract deployment costs
- **👤 Rich Profiles** - Name, bio, avatar, and custom links
- **💰 Direct Tips** - Receive ETH directly from supporters
- **📊 Analytics Dashboard** - Track tips, supporter count, and earnings
- **🔐 Self-Custody** - Withdraw your tips anytime to your wallet
- **🌐 Discoverability** - Get found by new supporters

### For Supporters  
- **🎯 Easy Tipping** - Send ETH with personalized messages
- **🔍 Creator Discovery** - Browse and discover new creators
- **💬 Message Support** - Send encouragement with your tips
- **⚡ Low Gas Fees** - Efficient Stylus smart contracts
- **🔗 Web3 Native** - Connect any Ethereum-compatible wallet

### For the Platform
- **🏭 Factory Pattern** - One contract serves all creators
- **💼 Revenue Model** - Optional platform fees (2.5% default)
- **🛠️ Upgradeable** - Modular architecture for improvements
- **📈 Analytics** - Platform-wide statistics and insights

## 🏗️ Architecture

Gyfted uses a factory contract pattern where a single smart contract manages multiple creators:

```
Gyfted Factory Contract
├── Creator Registry (profiles, balances)
├── Tip Processing (with optional platform fees)
├── Withdrawal System (creator-specific balances)
└── Discovery System (public creator listings)
```

**Key Components:**
- **Factory Contract**: Main contract managing all creators
- **Creator Profiles**: On-chain metadata (name, bio, avatar)
- **Tip Balances**: Individual creator balances
- **Event System**: Real-time tip notifications
- **Fee Management**: Optional platform sustainability model

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Cargo Stylus](https://docs.arbitrum.io/stylus/cargo-stylus)
- [Node.js](https://nodejs.org/) v18+ (for frontend)
- An Arbitrum testnet wallet with ETH

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gyfted.git
   cd gyfted
   ```

2. **Install Stylus toolchain**
   ```bash
   cargo install cargo-stylus
   ```

3. **Build the contract**
   ```bash
   cargo build --release --target wasm32-unknown-unknown
   ```

4. **Deploy to Arbitrum Sepolia**
   ```bash
   cargo stylus deploy \
     --private-key="your-private-key" \
     --endpoint="https://sepolia-rollup.arbitrum.io/rpc"
   ```

5. **Export ABI for frontend integration**
   ```bash
   cargo stylus export-abi
   ```

### Smart Contract Usage

#### For Creators

**Register as a creator:**
```rust
// Call this function to join Gyfted
register_creator(
    name: "Alice Developer",
    bio: "Full-stack developer building Web3 tools", 
    avatar_url: "https://example.com/alice.jpg"
)
```

**Update your profile:**
```rust
update_profile(
    name: "Alice | Rust Developer", 
    bio: "Building the future with Rust and Web3",
    avatar_url: "https://newurl.com/alice.jpg"
)
```

**Withdraw your tips:**
```rust
withdraw_my_tips() // Sends all accumulated tips to your wallet
```

#### For Supporters

**Send a tip:**
```rust
tip_creator(
    creator: "0x742d35Cc6Bf5432532532B4C9c47",
    message: "Love your tutorials! Keep it up! 🚀"
) // Send ETH with the transaction
```

#### View Functions

```rust
// Get creator profile
get_creator_profile(creator_address)

// Check creator's tip balance  
get_creator_balance(creator_address)

// Browse all creators
get_registered_creators()

// Check platform fee
get_platform_fee() // Returns basis points (250 = 2.5%)
```

## 💻 Frontend Integration

### Web3 Setup

```javascript
import { ethers } from 'ethers';
import GiftedABI from './contracts/Gyfted.json';

// Connect to contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(contractAddress, GiftedABI, provider);

// Send a tip
async function tipCreator(creatorAddress, message, amount) {
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
  
  const tx = await contractWithSigner.tip_creator(
    creatorAddress,
    message,
    { value: ethers.utils.parseEther(amount) }
  );
  
  return await tx.wait();
}

// Listen for tip events
contract.on("TipSent", (supporter, creator, amount, message) => {
  console.log(`${supporter} tipped ${creator}: ${message}`);
});
```

### React Component Example

```jsx
import { useState, useEffect } from 'react';

function CreatorProfile({ creatorAddress }) {
  const [profile, setProfile] = useState(null);
  const [tipAmount, setTipAmount] = useState('0.001');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCreatorProfile();
  }, [creatorAddress]);

  const loadCreatorProfile = async () => {
    const profileData = await contract.get_creator_profile(creatorAddress);
    setProfile(profileData);
  };

  const sendTip = async () => {
    try {
      await tipCreator(creatorAddress, message, tipAmount);
      alert('Tip sent successfully!');
      setMessage('');
    } catch (error) {
      alert('Error sending tip: ' + error.message);
    }
  };

  return (
    <div className="creator-card">
      <img src={profile?.avatar_url} alt={profile?.name} />
      <h3>{profile?.name}</h3>
      <p>{profile?.bio}</p>
      
      <div className="tip-form">
        <input 
          type="number" 
          value={tipAmount} 
          onChange={(e) => setTipAmount(e.target.value)}
          step="0.001"
          min="0.001"
          placeholder="Amount in ETH"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message of support..."
        />
        <button onClick={sendTip}>Send Tip ☕</button>
      </div>
    </div>
  );
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_factory_system

# Run with output
cargo test -- --nocapture
```

### Integration Tests

```bash
# Deploy to local testnet
cargo stylus deploy --endpoint="http://localhost:8547"

# Run integration test suite
npm run test:integration
```

### Example Test Cases

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_creator_registration() {
        let mut factory = CoffeeFactory::default();
        factory.constructor(U256::from(250)); // 2.5% fee
        
        // Register creator
        let result = factory.register_creator(
            "Alice".to_string(),
            "Developer".to_string(), 
            "https://alice.com/avatar.jpg".to_string()
        );
        assert!(result.is_ok());
        
        // Verify registration
        let profile = factory.get_creator_profile(msg::sender());
        assert!(profile.is_active);
        assert_eq!(profile.name, "Alice");
    }

    #[test]
    fn test_tipping_flow() {
        // Test complete tip -> withdraw flow
        // Implementation details...
    }
}
```

## 📊 Smart Contract Details

### Storage Layout

```rust
pub struct CoffeeFactory {
    // Creator balances: creator_address => tip_balance
    mapping(address => uint256) creator_balances;
    
    // Creator profiles: creator_address => profile_data
    mapping(address => CreatorProfile) creator_profiles;
    
    // All registered creators for discovery
    address[] registered_creators;
    
    // Platform configuration
    address factory_owner;
    uint256 platform_fee_basis_points; // 250 = 2.5%
}
```

### Events

```rust
// Emitted when someone sends a tip
event TipSent(
    address indexed supporter,
    address indexed creator,
    uint256 amount,
    string message
);

// Emitted when a creator registers
event CreatorRegistered(
    address indexed creator,
    string name
);

// Emitted when tips are withdrawn
event TipsWithdrawn(
    address indexed creator,
    uint256 amount,
    uint256 platform_fee
);
```

### Gas Costs (Approximate)

| Function | Gas Cost | USD (20 gwei) |
|----------|----------|---------------|
| Register Creator | ~80,000 | ~$2.40 |
| Send Tip | ~50,000 | ~$1.50 |
| Withdraw Tips | ~45,000 | ~$1.35 |
| Update Profile | ~35,000 | ~$1.05 |

## 🔒 Security Considerations

### Access Control
- ✅ Creators can only withdraw their own tips
- ✅ Only factory owner can withdraw platform fees
- ✅ Profile updates restricted to profile owner
- ✅ Input validation on all functions

### Economic Security
- ✅ Reentrancy protection on withdrawals
- ✅ Integer overflow protection (Rust native)
- ✅ Platform fee caps (max 10%)
- ✅ Minimum tip amounts to prevent spam

### Best Practices
- 🔍 **Audit Required**: This contract needs professional audit before mainnet
- 🧪 **Test Thoroughly**: Extensive testing on testnets required
- 📊 **Monitor Events**: Set up monitoring for unusual activity
- 🔒 **Multisig**: Consider multisig for factory owner operations

## 🛣️ Roadmap

### Phase 1: Core Platform ✅
- [x] Factory contract architecture
- [x] Creator registration system
- [x] Basic tipping functionality
- [x] Profile management

### Phase 2: Enhanced Features 🔄
- [ ] Subscription tipping (monthly/recurring)
- [ ] Tip goals and milestones
- [ ] Creator verification system
- [ ] Advanced analytics dashboard

### Phase 3: Platform Growth 📈
- [ ] Mobile app (React Native)
- [ ] Social features (creator following)
- [ ] Integration APIs for external platforms
- [ ] Multi-token support (USDC, DAI, etc.)

### Phase 4: Ecosystem 🌐
- [ ] Creator NFT rewards
- [ ] Governance token (GYFT)
- [ ] DAO treasury management
- [ ] Cross-chain support

## 🤝 Contributing

We welcome contributions from developers, designers, and Web3 enthusiasts!

### Development Setup

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Install dependencies**: `npm install && cargo build`
4. **Run tests**: `cargo test && npm test`
5. **Submit PR**: Make sure tests pass and code is documented

### Contribution Areas

- **Smart Contract**: Rust/Stylus development
- **Frontend**: React/TypeScript/Web3 integration  
- **Design**: UI/UX improvements
- **Documentation**: Tutorials, guides, API docs
- **Testing**: Security audits, integration tests

### Code Style

```bash
# Format Rust code
cargo fmt

# Lint Rust code  
cargo clippy

# Format TypeScript/JavaScript
npm run format

# Lint frontend code
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Community

- **Documentation**: [docs.gyfted.com](https://docs.gyfted.com)
- **Discord**: [discord.gg/gyfted](https://discord.gg/gyfted)
- **Twitter**: [@gyfted_app](https://twitter.com/gyfted_app)
- **Email**: hello@gyfted.com
- **GitHub Issues**: [Report bugs](https://github.com/your-username/gyfted/issues)

## 🔗 Links

- **Live App**: [app.gyfted.com](https://app.gyfted.com)
- **Arbitrum Contract**: `0x...` (Coming soon)
- **Block Explorer**: [arbiscan.io](https://arbiscan.io)
- **Stylus Docs**: [docs.arbitrum.io/stylus](https://docs.arbitrum.io/stylus)

## ⚠️ Disclaimer

Gyfted is experimental software. Use at your own risk. Always do your own research and never invest more than you can afford to lose. This software has not been audited and should not be used with significant funds without proper security review.

---

**Built with ❤️ by the Web3 community**

*Empowering creators in the decentralized future*