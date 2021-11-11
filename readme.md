# FIAT DAO - Airdrop MerkleTree distributor

This is a fork of [UniverseXYZ MerkleDistributor](https://github.com/UniverseXYZ/merkle-distributor).

### 1. Clone this repo
```shell
git clone https://github.com/fiatdao/airdrop
```

### 2. Install dependencies
```shell
npm install
```

### 3. Run tests
```shell
npm test
```

### 4. Deployment
```shell
// Rinkeby
npx hardhat --network rinkeby deploy-airdrop-test --rewardtoken "" --emergencyreceiver "" --bonusstart "" --weeksbonusduration "" --weeksemergency ""

// Mainnet
npx hardhat --network rinkeby deploy-airdrop --rewardtoken "" --emergencyreceiver "" --bonusstart "" --weeksbonusduration "" --weeksemergency ""
```

# Active Contracts

## Mainnet Contracts

### Addresses

[MerkleDistributor](https://etherscan.io/)

`Merkle root hash: `

### Distribution File
**Note:** The file used in the deployment and root generation is [here](./scripts/airdrop.json).


[MerkleDistributor](https://rinkeby.etherscan.io)

## Rinkeby Contracts

### Addresses

[Rinkeby-FDT](https://rinkeby.etherscan.io/address/0xb9e8d9890b41eb4b21b52353a5d4671f48b9840f)

[MerkleDistributor](https://rinkeby.etherscan.io/address/0x060E8FEFE51eB550147bAec5265BdB6F6aD6CcC4#code)

`Merkle root hash: 0xe3e4b3efdbcae06ea9c423f236f7b41c3d4a88ab9f19487a6b0e64b008c7316a`

### Distribution File
**Note:** The file used in the deployment and root generation is [here](./scripts/airdrop-test.json).
