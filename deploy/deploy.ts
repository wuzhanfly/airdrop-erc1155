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


async function deploy_test(reward_token: string, emergency_receiver: string, sbonus_start: string, sweeks_bonus_duration: string, sweeks_emergency: string) {
	await hardhat.run('compile');

	const bonus_start = Number.parseInt(sbonus_start);
	const weeks_bonus_duration = Number.parseInt(sweeks_bonus_duration);
	const weeks_emergency = Number.parseInt(sweeks_emergency);

	const bonus_end = bonus_start + (60 * 60 * 24 * 7 * weeks_bonus_duration);
	const emergency_starts = bonus_end + (60 * 60 * 24 * 7 * weeks_emergency);

	const airdropAccounts = airdrop_test.map((drop) => ({
		account: drop.address,
		amount: ethers.utils.parseEther(drop.earnings.toString())
	}));

	const tree = new BalanceTree(airdropAccounts);
	const root = tree.getHexRoot();
	const totalAllocatedAirdrop = calculateTotalAirdrop(airdropAccounts);

	console.log("###############################################");
	console.log(`merkle tree root: ${root}`);
	console.log("##############################################");

	const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor');
	const merkleInstance = await MerkleDistributor.deploy(
		reward_token,
		root,
		airdropAccounts.length,
		totalAllocatedAirdrop,
		bonus_start,
		bonus_end,
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
		constructorArguments: [reward_token, root, airdropAccounts.length, totalAllocatedAirdrop, bonus_start, bonus_end, emergency_starts, emergency_receiver],
		contract: "contracts/MerkleDistributor.sol:MerkleDistributor",
	});

	console.log('MerkleDistributor Address: ', merkleInstance.address);
}

async function deploy(reward_token: string, emergency_receiver: string, sbonus_start: string, sweeks_bonus_duration: string, sweeks_emergency: string) {
	await hardhat.run('compile');

	const bonus_start = Number.parseInt(sbonus_start);
	const weeks_bonus_duration = Number.parseInt(sweeks_bonus_duration);
	const weeks_emergency = Number.parseInt(sweeks_emergency);

	const bonus_end = bonus_start + (60 * 60 * 24 * 7 * weeks_bonus_duration);
	const emergency_starts = bonus_end + (60 * 60 * 24 * 7 * weeks_emergency);

	const airdropAccounts = airdrop.map((drop) => ({
		account: drop.address,
		amount: ethers.utils.parseEther(drop.earnings.toString())
	}));

	const tree = new BalanceTree(airdropAccounts);
	const root = tree.getHexRoot();
	const totalAllocatedAirdrop = calculateTotalAirdrop(airdropAccounts);

	console.log("###############################################");
	console.log(`merkle tree root: ${root}`);
	console.log("##############################################");

	const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor');
	const merkleInstance = await MerkleDistributor.deploy(
		reward_token,
		root,
		airdropAccounts.length,
		totalAllocatedAirdrop,
		bonus_start,
		bonus_end,
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
		constructorArguments: [reward_token, root, airdropAccounts.length, totalAllocatedAirdrop, bonus_start, bonus_end, emergency_starts, emergency_receiver],
		contract: "contracts/MerkleDistributor.sol:MerkleDistributor",
	});

	console.log('MerkleDistributor Address: ', merkleInstance.address);
}

module.exports = {deploy, deploy_test}
