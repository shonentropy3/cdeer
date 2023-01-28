// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {DeOrderTest} from "./DeOrder.t.sol";
import "forge-std/console2.sol";
contract Withdraw is DeOrderTest {
    // issuer check worker withdraw
    // @Summary 测试提交交付后 甲方验收 和乙方提款 成功
    //due
    function testDueWithdraw() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, address(0), 100 ether); // 创建Order

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, 1, amounts, periods, "Due", ""); // 阶段划分

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        payOrder(issuer, 200 ether, zero); // 付款

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //任務開始
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(10000);

        // //任務中調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //任务延期后调用
        prolongStage(issuer, worker, 1, 0, 1000, "");
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //增加階段
        appendStage(issuer, worker, 1, 100 ether, 4000, "");
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(100000);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        //第一个阶段完成
        vm.warp(173800);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 95 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //任務結束
        vm.warp(1728000);

        // //任務結束後調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        
        assertEq(address(worker).balance, 190 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 190 ether);
 

        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        console2.log(address(owner).balance);
    }
    //Confirm
    function testConfirmWithdraw() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, address(0), 100 ether); // 创建Order

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, 1, amounts, periods, "Confirm", ""); // 阶段划分

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        payOrder(issuer, 200 ether, zero); // 付款

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //任務開始
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(10000);

        // //任務中調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //任务延期后调用
        prolongStage(issuer, worker, 1, 0, 1000, "");
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //增加階段
        appendStage(issuer, worker, 1, 100 ether, 4000, "");
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(100000);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 0 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        //第一个阶段完成
        vm.warp(173800);
        stageIndexs = [0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 95 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);

        // //任務結束
        vm.warp(1728000);
        stageIndexs = [1];
        confirmDelivery(issuer, 1, stageIndexs);

        // //任務結束後調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(issuer,1, issuer);
        withdraw(worker,1, worker);
        
        assertEq(address(worker).balance, 190 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        withdraw(other, 1, other);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        withdraw(worker,1, worker);
        assertEq(address(worker).balance, 190 ether);
    }


}
