# FIAT DAO - ERC1155 Airdrop MerkleTree distributor

### 1. Clone this repo
```shell
git clone https://github.com/fiatdao/airdrop-erc1155
```

### 2. Install dependencies
```shell
yarn install
```

### 3. Run tests
```shell
npx hardhat test
```

### 4. Deployment
```shell
// Rinkeby
npx hardhat --network rinkeby deploy-airdrop-test --erc1155token "" --tokenid "" --emergencyreceiver "" --weeksemergency ""

// Mainnet
npx hardhat --network rinkeby deploy-airdrop --erc1155token "" --tokenid "" --emergencyreceiver "" --weeksemergency ""
```

# Airdrop lists

The lists of entitled wallets in the Age of Romulus NFT airdrops are located in the `data` folder. The lists are created using this [python script](https://colab.research.google.com/drive/13woncFVJ7KR29bLidRPMU-30QMp8v2GJ?usp=sharing). Note that the script will be updated going forward reflecting the logic of the various airdrops.

# Active Contracts

## Mainnet Contracts

### Addresses

[MerkleDistributor Amphora](https://etherscan.io/address/0x3658D9be7eADadD55aCCBc31a6fD232aEC1719Ed#code)

`Amphora Merkle root hash: 0x802133371213b3157410bbda5c614b24be5130233817b77507f11664f32c2773`

### Distribution File
**Note:** The file used in the deployment and root generation is [here](./scripts/airdrop.json).

## Rinkeby Contracts

### Addresses

[Rinkeby-FDT](https://rinkeby.etherscan.io/address/0xb9e8d9890b41eb4b21b52353a5d4671f48b9840f)
[ERC1155 Token](https://rinkeby.etherscan.io/address/0x53c319038c19820a50e07a8ac305fb9d641948d2)

[MerkleDistributor](https://rinkeby.etherscan.io/address/0xE3D597f96df4A499EA676A65913905054d9cB14F#code)

`Merkle root hash: 0x957731ff8ac28b02a89fa4821ca837e8846025eb75778176689062b0732390d7`

### Distribution File
**Note:** The file used in the deployment and root generation is [here](./scripts/airdrop-test.json).
