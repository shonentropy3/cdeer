// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import "../../src/DeOrder.sol";
import "../../src/libs/ECDSA.sol";
import "../../src/mock/WETH.sol";

contract Utilities is Test {
    DeOrder internal deOrder;
    WETH internal _weth;

    function setUp() public {
        _weth = new WETH();
    }
}
