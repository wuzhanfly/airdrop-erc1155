import { NetworksUserConfig } from 'hardhat/types';
import { EtherscanConfig } from '@nomiclabs/hardhat-etherscan/dist/src/types';

export const networks: NetworksUserConfig = {
	// Needed for `solidity-coverage`
	coverage: {
		url: 'http://localhost:8555',
	},

	// Rinkeby
	rinkeby: {
		url: 'https://rinkeby.infura.io/v3/',
		chainId: 4,
		accounts: [""],
		gas: 'auto',
		gasPrice: 3000000000, // 1 gwei
		gasMultiplier: 1.5,
	},

	// // Mainnet
	// mainnet: {
	// 	url: 'https://mainnet.infura.io/v3/',
	// 	chainId: 1,
	// 	accounts: [''],
	// 	gas: 'auto',
	// 	gasPrice: 145000000000,
	// 	gasMultiplier: 1.5,
	// },
};

// Use to verify contracts on Etherscan
// https://buidler.dev/plugins/nomiclabs-buidler-etherscan.html
export const etherscan: EtherscanConfig = {
	apiKey: '',
};
