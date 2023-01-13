// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/DeStage.sol";
import "contracts/interface/IOrder.sol";
import {DeOrderTest} from "./Deorder.t.sol";

contract StartOrder is DeOrderTest {
    // testCannotStartOrder
    // @Summary 开始任务
    function testCannotStartOrder() public {
        createOrder(); // 创建Order
        // 阶段划分未完成
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        startOrder(issuer);
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        // 订单没有付款
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1));
        startOrder(issuer);
        // 订单Amount和阶段Amount不等
        vm.startPrank(issuer);
        deOrder.modifyOrder(1, address(0), 1);
        vm.stopPrank();
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 0));
        startOrder(issuer);
    }

    // testStartOrder
    // @Summary 开始任务
    function testStartOrder() public {
        createOrder(); // 创建Order
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 付款
        // 甲方调用
        startOrder(issuer);
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assert(order.progress == OrderProgess.Ongoing);
        assert(stages[0].status == DeStage.StageStatus.Accepted);
    }
}
