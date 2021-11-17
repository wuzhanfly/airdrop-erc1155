// SPDX-License-Identifier: MIT
/** @notice this contract is for tests only */

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/presets/ERC1155PresetMinterPauser.sol";

contract FiatERC1155 is ERC1155PresetMinterPauser {
	constructor() ERC1155PresetMinterPauser("https://ipfs.io/ipfs/{id}.json ipfs.io/ipfs") {}
}
