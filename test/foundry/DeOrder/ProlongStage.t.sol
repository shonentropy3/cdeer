// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/DeStage.sol";
import "contracts/libs/ECDSA.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract ProlongStage is DeOrderTest {
    uint[] _stageIndexs = [0, 1];

    // testCannotProlongStage
    // @Summary 延长阶段失败情况
    function testCannotProlongStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(worker, issuer, amounts, periods, "Confirm", ""); // 许可阶段划分
        // 任务不在进行中
        prolongStage(worker, issuer, 1, 1, 1000, enFunc("ProgressError()"));
        // 任务进行中
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer);
        // orderID为空或其他的orderID调用失败
        prolongStage(issuer, worker, 100, 1, 1000, enFunc("ProgressError()"));
        // 使用过期deadline调用失败
        vm.warp(1000002);
        prolongStage(issuer, worker, 1, 1, 1000, enFunc("Expired()"));
        vm.warp(0);
        // 对已结束的order调用
        confirmDelivery(issuer, 1, _stageIndexs);
        withdraw(worker, 1, worker);
        prolongStage(issuer, worker, 1, 1, 1000, enFunc("ProgressError()"));
    }

    // 无该索引
    function testFailProlongStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(worker, issuer, amounts, periods, "Confirm", ""); // 许可阶段划分
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer);
        prolongStage(worker, issuer, 1, 1, 1000, "Index out of bounds");
    }

    // testProlongStage
    // @Summary 延长阶段
    function testProlongStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        permitStage(worker, issuer, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100, zero); // 支付
        startOrder(issuer); // 开始任务
        DeStage.Stage[] memory stages0 = deStage.getStages(1);
        prolongStage(issuer, worker, 1, 1, 1000, "");
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assertEq(stages0[0].period, stages[0].period);
        assertEq(stages0[1].period + 1000, stages[1].period);
    }
}
