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
        deOrder = new DeOrder(address(_weth));
    }

    // getSignBytes
    // @Summary 获取签名Bytes
    function getSignBytes(
        bytes32 TYPEHASH,
        uint256 _orderId,
        uint256[] memory _amounts,
        uint256[] memory _periods,
        uint256 nonce,
        uint256 deadline
    ) public returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                TYPEHASH,
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                nonce,
                deadline
            )
        );

        return ECDSA.toTypedDataHash(deOrder.DOMAIN_SEPARATOR(), structHash);
    }
}
