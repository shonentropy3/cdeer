// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/interface/IOrder.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract ModifyOrder is DeOrderTest {
    // testCannotModifyOrder
    // @Summary 修改Order失败情况
    function testCannotModifyOrder() public {
        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        // 非本人修改
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.modifyOrder(1, address(0), 1);
        // 非本人修改已经付款的Order
        payOrder(issuer, 100, zero); // 付款
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.modifyOrder(1, address(0), 1);
        // 【使用不存在的token地址，其他地址，不支持的token地址】
        vm.startPrank(issuer); // 甲方
        vm.expectRevert(abi.encodeWithSignature("UnSupportToken()"));
        deOrder.modifyOrder(
            1,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B),
            1
        );
        vm.stopPrank();
        // 任务已经开始修改
        startOrder(issuer); // 开始任务
        vm.startPrank(issuer); // 甲方
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        deOrder.modifyOrder(1, issuer, 1);
        vm.stopPrank();
    }

    // testModifyOrder
    // @Summary 修改Order
    function testModifyOrder() public {
        Order memory order;
        uint256 balance;

        createOrder(issuer, address(0), 100); // 创建Order
        vm.startPrank(issuer); // 甲方
        deOrder.modifyOrder(1, address(0), 1);
        vm.stopPrank();
        order = deOrder.getOrder(1);
        assertEq(order.token, address(0));
        assertEq(order.amount, 1);
        /* 更换token退款 (原生币改为Token)
         * @Expect 更改成功3，且退还一次金额
         * @Assert 返还金额一致
         */
        balance = issuer.balance;
        payOrder(issuer, 100, zero); // 付款
        assertEq(balance - 100, issuer.balance); // balance-100
        order = deOrder.getOrder(1);
        vm.startPrank(issuer); // 甲方
        vm.stopPrank();
        assertEq(order.payed, 100); // 支付了100
        assertEq(address(_weth).balance, 100); // weth合约余额
        setSupportToken(owner, address(token0), true);
        vm.startPrank(issuer); // 甲方
        deOrder.modifyOrder(1, address(token0), 1); // 修改Order
        vm.stopPrank();
        assertEq(balance, issuer.balance); // 已支付部分返还甲方
        order = deOrder.getOrder(1);
        assertEq(order.token, address(token0));
        assertEq(address(_weth).balance, 0); // weth合约余额
        assertEq(order.payed, 0); // 清除支付部分
        /* 更换token退款 (Token改为原生币)
         * @Expect 更改成功，且退还一次金额
         * @Assert 返还金额一致
         */
        balance = token0.balanceOf(issuer);
        vm.startPrank(issuer); // 甲方
        // token0.approve(address(deOrder), 100); // 授权
        vm.stopPrank();
        payOrder(issuer, 100, address(token0)); // 付款
        assertEq(balance - 100, token0.balanceOf(issuer)); // 用户balance-100
        assertEq(token0.balanceOf(address(deOrder)), 100); // 合约balance +100
        order = deOrder.getOrder(1);
        assertEq(order.payed, 100); // 支付了100
        vm.startPrank(issuer); // 甲方
        deOrder.modifyOrder(1, address(0), 1); // 修改为原生币
        vm.stopPrank();
        assertEq(balance, token0.balanceOf(issuer)); // 已支付部分返还甲方
        assertEq(token0.balanceOf(address(deOrder)), 0); // 合约balance 0
        order = deOrder.getOrder(1);
        assertEq(order.token, address(0));
        assertEq(order.payed, 0); // 清除支付部分
    }

    /* 更换token退款（未付款）(原生币改为Token)
     * @Expect 更改成功
     * @Assert order不用返还金额
     */
    function testModifyOrderNotPay() public {
        vm.deal(address(_weth), 1000 ether); // 初始化WETH原生币余额
        createOrder(issuer, address(0), 100); // 创建Order
        setSupportToken(owner, address(token0), true);
        modifyOrder(issuer, 1, address(token0), 1);
        assertEq(address(_weth).balance, 1000 ether); // weth合约余额
    }
}
