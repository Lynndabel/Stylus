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
   git clone https://github.com/Nanle-code/Stylus
   cd Stylus
   ```

2. **Install Stylus toolchain**
   ```bash
   cargo install cargo-stylus
   ```

3. **Build the contract**
   ```bash
   # Optional: type-check with Stylus tooling
   cargo stylus check

   # Build optimized WASM for Stylus
   cargo build --release --target wasm32-unknown-unknown
   ```

4. **Export ABI**
   The ABI is generated from the `#[public]` interfaces in `Stylus/src/lib.rs`.
   We provide a no-op `main` under the `export-abi` feature so this compiles cleanly.
   ```bash
   cargo stylus export-abi
   # Outputs an ABI JSON you can use in your frontend (e.g., in ./target/abi)
   ```

5. **Deploy to Arbitrum Sepolia**
   ```bash
   cargo stylus deploy \
     --private-key="your-private-key" \
     --endpoint="https://sepolia-rollup.arbitrum.io/rpc"
   ```

6. **Post-deploy**
   - Save the deployed address output by the deploy command
   - Verify events by sending a small test tip
   - Use the ABI JSON with ethers/web3 to integrate on the frontend

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
    address fee_recipient;             // recipient of platform fees
    uint256 platform_fees_accrued;     // accumulated fees (wei)
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

// Emitted when platform fee bps is updated
event PlatformFeeUpdated(
    uint256 oldFeeBps,
    uint256 newFeeBps
);

// Emitted when fee recipient is updated
event FeeRecipientUpdated(
    address oldRecipient,
    address newRecipient
);

// Emitted on each tip to record fee collected
event PlatformFeeAccrued(
    address indexed supporter,
    address indexed creator,
    uint256 feeAmount
);
```

### Admin Controls

Owner-only functions and config. The owner is set to the deployer in `constructor`.

```rust
// View current platform fee bps
get_platform_fee() -> uint256

// Update platform fee bps (capped at 500 = 5%)
set_platform_fee_basis_points(new_bps: uint256)

// View/set fee recipient address
get_fee_recipient() -> address
set_fee_recipient(new_recipient: address)

// View and withdraw accrued platform fees
get_platform_fees_accrued() -> uint256
withdraw_platform_fees()
```

Example (ethers.js):

```ts
import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc')
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
const contract = new ethers.Contract(address, abi, wallet)

// Read fee config
const feeBps = await contract.get_platform_fee()
const feeRecipient = await contract.get_fee_recipient()

// Update fee to 3%
await (await contract.set_platform_fee_basis_points(300)).wait()

// Set new fee recipient
await (await contract.set_fee_recipient('0xYourTreasury')).wait()

// Withdraw accrued fees
await (await contract.withdraw_platform_fees()).wait()
```

## 🏗️ Build & Deployment Notes

- The library exposes public interfaces via `#[public] impl CoffeeFactory` in `Stylus/src/lib.rs`.
- `Stylus/src/main.rs` contains a no-op `main` for normal builds and ABI export builds. This avoids missing-symbol issues while letting `cargo stylus export-abi` work.
- Recommended workflow:
  - **Local checks**: `cargo stylus check`
  - **Build**: `cargo build --release --target wasm32-unknown-unknown`
  - **Export ABI**: `cargo stylus export-abi`
  - **Deploy**: `cargo stylus deploy --endpoint <RPC> --private-key <KEY>`

If you’re using a frontend, place the generated ABI JSON where your app expects it (e.g., `frontend/src/contracts/CoffeeFactory.json`) and keep the deployed address in your environment config.

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