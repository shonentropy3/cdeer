// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import "contracts/DeOrder.sol";
import "contracts/libs/ECDSA.sol";
import "contracts/mock/WETH.sol";

contract Utilities is Test {
    DeOrder internal deOrder;
    WETH internal _weth;

    function setUp() public {
        _weth = new WETH();
    }
}
