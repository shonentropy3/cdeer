// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/DeStage.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract AppendStage is DeOrderTest {
    uint[] _stageIndexs = [0, 1];

    //testCannotAppendStage
    // @Summary 添加阶段失败情况
    function testCannotAppendStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(worker, issuer, 1, amounts, periods, "Confirm", ""); // 许可阶段划分
        // 任务不在进行中
        appendStage(issuer, worker, 1, 10, 1000, enFunc("ProgressError()"));
        // 任务进行中
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer);
        // orderID为空或其他的orderID调用失败
        appendStage(issuer, worker, 100, 10, 1000, enFunc("ProgressError()"));
        // 使用过期deadline调用失败
        vm.warp(1000002);
        appendStage(issuer, worker, 1, 10, 1000, enFunc("Expired()"));
        vm.warp(0);
        // 对已结束的order调用
        confirmDelivery(issuer, 1, _stageIndexs);
        withdraw(worker, 1, worker);
        appendStage(issuer, worker, 1, 1, 1000, enFunc("ProgressError()"));
    }

    // testAppendStage
    // @Summary 测试添加阶段
    function testAppendStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(worker, issuer, 1, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 支付
        startOrder(issuer); // 开始任务
        DeStage.Stage[] memory stages0 = deOrder.getStages(1);
        payOrder(issuer, 10, zero); // 支付
        appendStage(worker, issuer, 1, 10, 1000, "");
        DeStage.Stage[] memory stages = deOrder.getStages(1);
        assertEq(stages0.length, 2);
        assertEq(stages.length, 3);
        assertEq(stages[2].period, 1000);
        assertEq(stages[2].amount, 10);
    }
}
