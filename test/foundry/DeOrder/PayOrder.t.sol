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
        uint balance = issuer.balance; // 甲方余额
        uint balanceOfWeth = address(_weth).balance; // 合约余额
        payOrder(issuer, 100, zero);
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 100);
        assertEq(issuer.balance, balance - 100);
        assertEq(address(_weth).balance, balanceOfWeth + 100);

        // 付款-代币
        setSupportToken(owner, address(token0), true);
        modifyOrder(issuer, 1, address(token0), 100);
        uint balance2 = token0.balanceOf(issuer); // 甲方余额
        uint balanceOfWeth2 = token0.balanceOf(address(deOrder)); // 合约余额
        payOrder(issuer, 100, address(token0));
        Order memory order2 = deOrder.getOrder(1);
        assertEq(order2.payed, 100);
        assertEq(token0.balanceOf(issuer), balance2 - 100);
        assertEq(token0.balanceOf(address(deOrder)), balanceOfWeth2 + 100);
    }

    // testPayOrderWithPermit2
    // @Summary 测试使用Permit2付款
    function testPayOrderWithPermit2() public {
        setSupportToken(owner, address(token0), true);
        createOrder(issuer, address(token0), 100); // 创建Order
        permitStage(worker, issuer, amounts, periods, "Confirm", ""); // 正常划分阶段
        // 付款-代币
        uint balance = token0.balanceOf(issuer); // 甲方余额
        uint balanceOfDeOrder = token0.balanceOf(address(deOrder)); // 合约余额
        payOrderWithPermit2(issuer, 1, 100, address(token0));
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 100);
        assertEq(token0.balanceOf(issuer), balance - 100);
        assertEq(token0.balanceOf(address(deOrder)), balanceOfDeOrder + 100);
    }
}
