// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {DeOrderTest} from "./DeOrder.t.sol";

contract SubmitDelivery is DeOrderTest {
    // submit delivery
    // @Summary 提交交付
    function submitDelivery() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer); // 开始任务
        vm.startPrank(worker); // 乙方
        deOrder.updateAttachment(1, "ok");
        vm.stopPrank();
    }

    // submit delivery
    // @Summary 测试提交交付失败
    function testCannotSubmitDelivery() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer); // 开始任务
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.updateAttachment(1, "ok");
    }
}
