import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { MerkleDistributor } from "../typechain";
import { FiatERC1155 } from "../typechain";
import { expect } from "chai";
import BalanceTree from "../src/balance-tree";
import airdrop_unit_test from "../scripts/airdrop-unit-test.json";


describe("Token", function () {
	let accounts: Signer[];
	let now = parseInt((new Date().getTime() / 1000).toString());
	let erc1155: FiatERC1155;
	const tokenId = 1;
	const totalSupply = 100;
	let tree: BalanceTree;
	const emergencyTimeout = now + (60 * 60 * 24) * 1; // one day from now
	let merkle: Contract;
	let account0: string;
	let account1: string;
	let account2: string;

	beforeEach(async function () {
		accounts = await ethers.getSigners();
		account0 = await accounts[0].getAddress();
		account1 = await accounts[1].getAddress();
		account2 = await accounts[2].getAddress();

		const airdropAccounts = airdrop_unit_test.map((drop) => ({
			account: drop.address,
			amount: BigNumber.from(drop.earnings.toString())
		}));

		tree = new BalanceTree(airdropAccounts);
		const rootHash = tree.getHexRoot();

		const ERC1155Contract = await ethers.getContractFactory("FiatERC1155");
		erc1155 = await ERC1155Contract.deploy();

		const MekleDistributor = await ethers.getContractFactory("MerkleDistributor");
		merkle = await MekleDistributor.deploy(
			erc1155.address,
			tokenId,
			rootHash,
			emergencyTimeout,
			account0
		);
		await erc1155.mint(merkle.address, tokenId, totalSupply, "0x00");


	});

	it("should deploy contract", async () => {
		const airdropAccounts = airdrop_unit_test.map((drop) => ({
			account: drop.address,
			amount: ethers.utils.parseEther(drop.earnings.toString())
		}));

		tree = new BalanceTree(airdropAccounts);
		const rootHash = tree.getHexRoot();

		const ERC1155Contract = await ethers.getContractFactory("FiatERC1155");
		erc1155 = await ERC1155Contract.deploy();

		const MekleDistributor = await ethers.getContractFactory("MerkleDistributor");
		merkle = await MekleDistributor.deploy(
			erc1155.address,
			tokenId,
			rootHash,
			emergencyTimeout,
			account0
		);
		await erc1155.mint(merkle.address, tokenId, totalSupply, "0x00");
	});

	it("should set constructor values", async () => {
		const ctoken = await merkle.erc1155Token();
		const ctokenId = await merkle.tokenId();
		const cmerkleRoot = await merkle.merkleRoot();
		const cemergencyTimeout = await merkle.emergencyTimeout();
		const cemergencyReceiver = await merkle.emergencyReceiver();

		const ctotalBalance = await erc1155.balanceOf(merkle.address, tokenId);

		expect(ctoken).eq(erc1155.address);
		expect(ctokenId).eq(tokenId);
		expect(cmerkleRoot).eq(tree.getHexRoot());
		expect(cemergencyTimeout).eq(emergencyTimeout);
		expect(cemergencyReceiver).eq(account0);

		expect(ctotalBalance).eq(totalSupply);
	});

	it("should have valid claims", async () => {
		let claim = await merkle.isClaimed(0);
		expect(claim).to.eq(false);
		claim = await merkle.isClaimed(1);
		expect(claim).to.eq(false);
	});

	it("should allow to claim", async () => {
		const balanceMerkleBefore = await erc1155.balanceOf(merkle.address, tokenId);

		await ethers.provider.send("evm_mine", []);
		const proof0 = tree.getProof(0, account0, BigNumber.from(1));

		await expect(merkle.claim(0, account0, 1, proof0)).to.emit(
			merkle,
			"Claimed"
		);

		await ethers.provider.send("evm_mine", []);
		const proof1 = tree.getProof(1, account1, BigNumber.from(1));
		await expect(
			merkle.connect(accounts[1]).claim(1, account1, BigNumber.from(1), proof1)
		).to.emit(merkle, "Claimed");

		// expect first claimer to have correct balance
		const balance0 = await erc1155.balanceOf(account0, tokenId);
		expect(balance0.eq(BigNumber.from(1))).to.eq(true);

		// expect last claimer to have correct balance
		const balance1 = await erc1155.balanceOf(account1, tokenId);
		expect(balance1.eq(BigNumber.from(1))).to.eq(true);

		// expect the Merkle contract to have less balance with 2
		const balanceMerkle = await erc1155.balanceOf(merkle.address, tokenId);
		expect(balanceMerkleBefore.eq(balanceMerkle.add(balance0.add(balance1)))).to.eq(true);
	});

	it("should have invalid claims", async () => {
		await ethers.provider.send("evm_mine", []);
		const proof0 = tree.getProof(0, account0, BigNumber.from(1));

		await expect(merkle.claim(0, account0, 1, proof0)).to.emit(
			merkle,
			"Claimed"
		);

		await ethers.provider.send("evm_mine", []);
		const proof1 = tree.getProof(1, account1, BigNumber.from(1));
		await expect(
			merkle.connect(accounts[1]).claim(1, account1, BigNumber.from(1), proof1)
		).to.emit(merkle, "Claimed");

		let claim = await merkle.isClaimed(0);
		expect(claim).to.eq(true);
		claim = await merkle.isClaimed(1);
		expect(claim).to.eq(true);
	});

	it("should fail to emergency withdraw", async () => {
		await expect(merkle.emergencyWithdrawal()).to.be.revertedWith("TIMEOUT_NOT_EXPIRED");
	});

	it("should successfully do an emergency withdraw", async () => {
		const block = await ethers.provider.send("eth_getBlockByNumber", ["latest", false]);
		const currentTs = parseInt(block.timestamp);
		const diff = emergencyTimeout + 1  - currentTs;
		await ethers.provider.send("evm_increaseTime", [diff]);
		await ethers.provider.send("evm_mine", []);

		await merkle.emergencyWithdrawal();

		const balance0 = await erc1155.balanceOf(account0, tokenId);
		expect(balance0.eq(BigNumber.from(totalSupply))).to.eq(true);

		const balanceMerkle = await erc1155.balanceOf(merkle.address, tokenId);
		expect(balanceMerkle.eq(BigNumber.from(0))).to.eq(true);
	});
});
