// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../DeOrder/DeOrder.t.sol";

contract MulticallTest is DeOrderTest {
    function multicall(address who, bytes[] memory data) public {
        vm.startPrank(who);
        deOrder.multicall(data);
        vm.stopPrank();
    }

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

    function testMulticallPayOrderWithZero() public {
        createOrder(issuer, address(0), 100); // 创建Order

        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        data[1] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        deOrder.multicall{value: 100}(data);

        assertEq(address(_weth).balance, 100); // weth合约余额
    }

    function testMulticallPayOrderWithToken() public {
        // console.log(block.timestamp);
        // vm.warp(990000);
        // console.log(block.timestamp);
        createOrder(issuer, address(0), 100); // 创建Order
        setSupportToken(owner, address(token0), true);
        modifyOrder(issuer, 1, address(token0), 100);

        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        data[1] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        console.log(token0.balanceOf(issuer));

        multicall(issuer, data);
        assertEq(token0.balanceOf(address(deOrder)), 200);
    }
}
