// SPDX-License-Identifier: MIT

pragma solidity >0.6.0 <=0.7.1;

import { ERC20 } from "./ERC20.sol";

contract RUP is ERC20 {
    function decimals() public pure returns (uint8) {
        return 18;
    }

    function rounding() public pure returns (uint8) {
        return 2;
    }

    function name() public pure returns (string memory) {
        return "Rupee Token";
    }

    function symbol() public pure returns (string memory) {
        return "RUP";
    }
}

