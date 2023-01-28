// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../DeOrder/DeOrder.t.sol";

contract MulticallTest is DeOrderTest {
    function multicall(address who, bytes[] memory data) public {
        vm.startPrank(who);
        deOrder.multicall(data);
        vm.stopPrank();
    }


    function testMulticallWithCreateOrder() public {
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
            65,
            issuer,
            worker,
            address(0),
            200
        );
        deOrder.multicall(data);
        assertEq(deOrder.currOrderId(), 2);

        Order memory order = deOrder.getOrder(1);
        assertEq(order.taskId, 64);
        assertEq(order.issuer, issuer);
        assertEq(order.worker, worker);
        assertEq(order.token, address(0));
        assertEq(order.amount, 100);
        assertTrue(order.payType == PaymentType.Unknown);
        assertTrue(order.progress == OrderProgess.Init);
        assertEq(order.startDate, 0);
        assertEq(order.payed, 0);
        //
        order = deOrder.getOrder(2);
        assertEq(order.taskId, 65);
        assertEq(order.issuer, issuer);
        assertEq(order.worker, worker);
        assertEq(order.token, address(0));
        assertEq(order.amount, 200);
        assertTrue(order.payType == PaymentType.Unknown);
        assertTrue(order.progress == OrderProgess.Init);
        assertEq(order.startDate, 0);
        assertEq(order.payed, 0);
    }

    // testMulticallPayOrderWithZero Multicall调用多次付款原生币
    function testMulticallPayOrderWithZero() public {
        uint256 balance = issuer.balance; // 甲方余额
        createOrder(issuer, address(0), 100); // 创建Order

        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        data[1] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        vm.startPrank(issuer);
        deOrder.multicall{value: 100}(data);
        vm.stopPrank();
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 100);
        assertEq(address(_weth).balance, 100); // weth合约余额
        assertEq(issuer.balance, balance - 100);
    }

    // testMulticallPayOrderWithToken Multicall调用多次付款Token
    function testMulticallPayOrderWithToken() public {
        // console.log(block.timestamp);
        // vm.warp(990000);
        // console.log(block.timestamp);
        uint256 balance = token0.balanceOf(issuer); // 甲方余额
        createOrder(issuer, address(0), 100); // 创建Order
        setSupportToken(owner, address(token0), true);
        modifyOrder(issuer, 1, address(token0), 100);

        bytes[] memory data = new bytes[](2);
        data[0] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        data[1] = abi.encodeWithSelector(deOrder.payOrder.selector, 1, 100);
        console.log(token0.balanceOf(issuer));
        multicall(issuer, data);
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 200);
        assertEq(token0.balanceOf(address(deOrder)), 200);
        assertEq(token0.balanceOf(issuer), balance - 200);
    }

    // testMulticallPayOrderWithToken Multicall调用多次付款Token
    function testMulticallPayOrderWithTokenAndZero() public {
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
