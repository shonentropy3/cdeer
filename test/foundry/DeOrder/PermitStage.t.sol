// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "contracts/DeStage.sol";
import "contracts/interface/IOrder.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract PermitStage is DeOrderTest {
    // testPermitStage
    // @Summary 阶段划分
    function testPermitStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        // 甲方签名 乙方提交
         amounts = [100];
        periods = [1000];
        permitStage(issuer, worker, amounts, periods, "Due", "");
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, 100);
        assertEq(stages[0].period, 1000);
        assertTrue(order.payType == PaymentType.Due); // 付款模式
        // 乙方签名 甲方提交
        permitStage(worker, issuer, amounts, periods, "Confirm", "");
        order = deOrder.getOrder(1);
        stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, 100);
        assertEq(stages[0].period, 0);
        assertTrue(order.payType == PaymentType.Confirm); // 付款模式
    }

    // testCannotPermitStage
    // @Summary 许可阶段划分失败情况
    function testCannotPermitStage() public {
        createOrder(issuer, address(0), 100); // 创建Order
        // 甲方签名 && 甲方提交
        permitStage(
            issuer,
            issuer,
            amounts,
            periods,
            "Due",
            "PermissionsError()"
        );
        // 乙方签名 && 乙方提交
        permitStage(
            worker,
            worker,
            amounts,
            periods,
            "Due",
            "PermissionsError()"
        );
        // 乙方签名 && 其它人提交
        permitStage(
            worker,
            other,
            amounts,
            periods,
            "Due",
            "PermissionsError()"
        );
        // 其它人签名 && 乙方提交
        permitStage(
            other,
            worker,
            amounts,
            periods,
            "Due",
            "PermissionsError()"
        );
        // 任务已经开始 提交
        permitStage(worker, issuer, amounts, periods, "Due", ""); // 正常划分阶段
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer); // 开始任务
        permitStage(worker, issuer, amounts, periods, "Due", "ProgressError()");
    }
}
