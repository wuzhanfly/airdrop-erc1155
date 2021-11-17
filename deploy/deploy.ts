import hardhat  from "hardhat";
import airdrop from "../scripts/airdrop.json";
import airdrop_test from "../scripts/airdrop-test.json";
import BalanceTree from "../src/balance-tree";
import { BigNumber } from "ethers";
const ethers = hardhat.ethers;


const calculateTotalAirdrop = (accounts: any) => {
	return accounts.reduce(
		(accumulator: any, currentValue: any) => accumulator.add(currentValue.amount),
		BigNumber.from(0)
	);
};

async function deploy_test(erc_1155_token: string, token_id: string, emergency_receiver: string, sweeks_emergency: string) {
	await hardhat.run('compile');
	const now = Math.floor(Date.now() / 1000);

	const weeks_emergency = Number.parseInt(sweeks_emergency);

	const emergency_starts = now + (60 * 60 * 24 * 7 * weeks_emergency);

	const airdropAccounts = airdrop_test.map((drop) => ({
		account: drop.address,
		amount: BigNumber.from(drop.earnings.toString())
	}));

	const tree = new BalanceTree(airdropAccounts);
	const root = tree.getHexRoot();

	console.log("###############################################");
	console.log(`merkle tree root: ${root}`);
	console.log("##############################################");

	const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor');
	const merkleInstance = await MerkleDistributor.deploy(
		erc_1155_token,
		token_id,
		root,
		emergency_starts,
		emergency_receiver
	);

	await merkleInstance.deployTransaction.wait(5)

	console.log('Deploying MerkleDistributor, please wait...');
	await merkleInstance.deployed();
	console.log(`MerkleDistributor Deployed at ${merkleInstance.address}`)


	console.log('Verifying contract on Etherscan...');
	await hardhat.run("verify:verify", {
		address: merkleInstance.address,
		constructorArguments: [erc_1155_token, token_id, root, emergency_starts, emergency_receiver],
		contract: "contracts/MerkleDistributor.sol:MerkleDistributor",
	});

	console.log('MerkleDistributor Address: ', merkleInstance.address);
}

async function deploy(erc_1155_token: string, token_id: string, emergency_receiver: string, sweeks_emergency: string) {
	await hardhat.run('compile');
	const now = Math.floor(Date.now() / 1000);

	const weeks_emergency = Number.parseInt(sweeks_emergency);

	const emergency_starts = now + (60 * 60 * 24 * 7 * weeks_emergency);

	const airdropAccounts = airdrop.map((drop) => ({
		account: drop.address,
		amount: BigNumber.from(drop.earnings.toString())
	}));

	const tree = new BalanceTree(airdropAccounts);
	const root = tree.getHexRoot();

	console.log("###############################################");
	console.log(`merkle tree root: ${root}`);
	console.log("##############################################");

	const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor');
	const merkleInstance = await MerkleDistributor.deploy(
		erc_1155_token,
		token_id,
		root,
		emergency_starts,
		emergency_receiver
	);

	await merkleInstance.deployTransaction.wait(5)

	console.log('Deploying MerkleDistributor, please wait...');
	await merkleInstance.deployed();
	console.log(`MerkleDistributor Deployed at ${merkleInstance.address}`)


	console.log('Verifying contract on Etherscan...');
	await hardhat.run("verify:verify", {
		address: merkleInstance.address,
		constructorArguments: [erc_1155_token, token_id, root, emergency_starts, emergency_receiver],
		contract: "contracts/MerkleDistributor.sol:MerkleDistributor",
	});

	console.log('MerkleDistributor Address: ', merkleInstance.address);
}

module.exports = {deploy, deploy_test}
