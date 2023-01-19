// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "contracts/interface/IOrder.sol";
import {IPermit2} from "contracts/interface/IPermit2.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract PayOrder is DeOrderTest {
    // testPayOrder
    // @Summary 付款
    function testPayOrder() public {
        createOrder(issuer, address(0), 100); // 创建Order
        // 付款-原生币
        uint256 balance = issuer.balance; // 甲方余额
        uint256 balanceOfWeth = address(_weth).balance; // 合约余额
        payOrder(issuer, 100, zero);
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 100);
        assertEq(issuer.balance, balance - 100);
        assertEq(address(_weth).balance, balanceOfWeth + 100);

        // 付款-代币
        setSupportToken(owner, address(token0), true);
        modifyOrder(issuer, 1, address(token0), 100);
        uint256 balance2 = token0.balanceOf(issuer); // 甲方余额
        uint256 balanceOfWeth2 = token0.balanceOf(address(deOrder)); // 合约余额
        payOrder(issuer, 100, address(token0));
        Order memory order2 = deOrder.getOrder(1);
        assertEq(order2.payed, 100);
        assertEq(token0.balanceOf(issuer), balance2 - 100);
        assertEq(token0.balanceOf(address(deOrder)), balanceOfWeth2 + 100);

        // 发送和amount不相等情况
        modifyOrder(issuer, 1, address(0), 100);
        uint256 balance3 = issuer.balance; // 甲方余额
        uint256 balanceOfWeth3 = address(_weth).balance; // 合约余额
        vm.startPrank(issuer);
        deOrder.payOrder{value: 50}(1, 100);
        vm.stopPrank();
        Order memory order3 = deOrder.getOrder(1);
        assertEq(order3.payed, 50);
        assertEq(issuer.balance, balance3 - 50);
        assertEq(address(_weth).balance, balanceOfWeth3 + 50);
    }

    // testCannotPayOrder
    // @Summary 付款失败情况
    function testCannotPayOrder1() public {
        createOrder(issuer, address(0), 100); // 创建Order
        // 订单-原生币 用Token付款
        payOrder(issuer, 100, address(token0));
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 0);
    }

    // testCannotPayOrder
    // @Summary 付款失败情况
    function testCannotPayOrder2() public {
        setSupportToken(owner, address(token0), true);
        createOrder(issuer, address(token0), 100); // 创建Order
        // 订单-Token 用原生币付款
        vm.startPrank(issuer);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 0));
        deOrder.payOrder{value: 100}(1, 100);
        vm.stopPrank();
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 0);
    }
    // testCannotPayOrder
    // @Summary 付款失败情况--订单不存在付款
    function testCannotPayOrder3() public {
        vm.startPrank(issuer);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 0));
        deOrder.payOrder{value: 100}(1, 100);
        vm.stopPrank();
    }

    // testCannotPayOrder
    // @Summary 付款失败情况3--使用不存在的token
    function testFailPayOrder3() public {
        setSupportToken(
            owner,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B),
            true
        );
        createOrder(
            issuer,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B),
            100
        ); // 创建Order
        // 订单-原生币 用Token付款
        payOrder(
            issuer,
            100,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B)
        );
        Order memory order2 = deOrder.getOrder(1);
        assertEq(order2.payed, 0);
    }

    // testCannotPayOrder
    // @Summary 付款失败情况--余额不足
    function testCannotPayOrder4() public {
        createOrder(issuer, address(0), 100); // 创建Order
        // 订单-原生币 用Token付款
        payOrder(worker, 100, address(token0));
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 0);
    }

    // testCannotPayOrder
    // @Summary 付款失败情况--余额不足
    function testFailPayOrder5() public {
        setSupportToken(owner, address(token0), true);
        createOrder(issuer, address(token0), 100); // 创建Order
        payOrder(worker, 100, address(token0));
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 0);
    }

    // testPayOrderWithPermit2
    // @Summary 测试使用Permit2付款
    function testPayOrderWithPermit2() public {
        setSupportToken(owner, address(token0), true);
        createOrder(issuer, address(token0), 100); // 创建Order
        permitStage(worker, issuer, 1, amounts, periods, "Confirm", ""); // 正常划分阶段
        // 付款-代币
        uint256 balance = token0.balanceOf(issuer); // 甲方余额
        uint256 balanceOfDeOrder = token0.balanceOf(address(deOrder)); // 合约余额
        payOrderWithPermit2(issuer, 1, 100, address(token0));
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 100);
        assertEq(token0.balanceOf(issuer), balance - 100);
        assertEq(token0.balanceOf(address(deOrder)), balanceOfDeOrder + 100);
    }
}
