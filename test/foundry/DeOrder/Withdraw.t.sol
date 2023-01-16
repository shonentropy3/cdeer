// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {DeOrderTest} from "./DeOrder.t.sol";

contract Withdraw is DeOrderTest {
     // issuer check worker withdraw
    // @Summary 甲方验收 乙方提款
    function checkAndwithdraw() public {
        uint256[] memory _stageIndex = new uint256[](1);
        _stageIndex[0] = 0;
        vm.startPrank(issuer); // 甲方
        deOrder.confirmDelivery(1, _stageIndex);
        vm.stopPrank();
        vm.startPrank(worker); // 乙方
        deOrder.withdraw(1, worker);
        vm.stopPrank();
    }

    // issuer check worker withdraw
    // @Summary 测试 甲方验收 乙方提款失败
    function testCannotcheckAndwithdraw() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
        payOrder(issuer, 100, zero); // 付款
        startOrder(issuer); // 开始任务
        uint256[] memory _stageIndex = new uint256[](1);
        _stageIndex[0] = 0;
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.confirmDelivery(1, _stageIndex);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.withdraw(1, worker);
    }

    // issuer check worker withdraw
    // @Summary 测试提交交付后 甲方验收 和乙方提款 成功
    function testcheckAndwithdraw() public {
        // SubmitDelivery();
        // checkAndwithdraw();
    }
}