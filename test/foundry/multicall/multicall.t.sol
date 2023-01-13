// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../DeOrder.t.sol";

contract MulticallTest is DeTaskTest {
    function testMulticall() public {
        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(
            deOrder.createOrder.selector,
            64,
            issuer,
            worker,
            address(0),
            100
        );
        data[1] = abi.encodeWithSelector(
            deOrder.createOrder.selector,
            64,
            issuer,
            worker,
            address(0),
            100
        );
        deOrder.multicall(data);
    }

    function testMulticallpayOrder() public {
        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(
            deOrder.createOrder.selector,
            64,
            issuer,
            worker,
            address(0),
            100
        );
        data[1] = abi.encodeWithSelector(
            deOrder.createOrder.selector,
            64,
            issuer,
            worker,
            address(0),
            100
        );
        deOrder.multicall(data);
    }
}
