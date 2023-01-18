// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "contracts/interface/IOrder.sol";
import "forge-std/console2.sol";
import {DeOrderTest} from "./DeOrder.t.sol";

contract confirmDelivery is DeOrderTest {
    //Due
    function testDue() public{
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, zero, 100 ether);
        //未划分阶段验收
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(other, 1, stageIndexs);

        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分

        //order未开始验收阶段
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(other, 1, stageIndexs);

        // 付款
        payOrder(issuer, 100 ether, zero); 

        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(other, 1, stageIndexs);

        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(86400);
        //
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(other, 1, stageIndexs);
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)",1));
        refund(issuer, 1, issuer, 1 ether);
        withdraw(worker, 1, worker);
        assertEq(address(worker).balance,95 ether);
        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        console2.log(address(owner).balance);
    }
    function testConfirm() public{
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, zero, 100 ether);

        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分

        //order未开始验收阶段
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(other, 1, stageIndexs);

        // 付款
        payOrder(issuer, 100 ether, zero); 

        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        confirmDelivery(other, 1, stageIndexs);

        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(864000);
        //
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(other, 1, stageIndexs);
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)",1));
        refund(issuer, 1, issuer, 1 ether);
        withdraw(worker, 1, worker);
        assertEq(address(worker).balance,95 ether);
        // console2.log(address(issuer).balance);
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // console2.log(address(owner).balance);
    }
    

    function testDueAppendStage() public{
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, zero, 100 ether);
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); 
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        payOrder(issuer, 100 ether, zero);
        appendStage(issuer, worker, 1, 100 ether, 86400, '');

        //驗收第一個阶段
        vm.warp(182800);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(other, 1, stageIndexs);
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)",1));
        refund(issuer, 1, issuer, 1 ether);
        assertEq(address(issuer).balance,800 ether);
        withdraw(worker, 1, worker);
        assertEq(address(worker).balance,95 ether);

        //验收第二个阶段
        vm.warp(1828000);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(other, 1, stageIndexs);
        stageIndexs=[1];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)",1));
        refund(issuer, 1, issuer, 1 ether);
        assertEq(address(issuer).balance,800 ether);
        withdraw(worker, 1, worker);
        assertEq(address(worker).balance,190 ether);
        console2.log(address(issuer).balance);
        console2.log(address(worker).balance);
        console2.log(address(_weth).balance);
        console2.log(address(owner).balance);
    }

    function testConfirmAppendStage() public{
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, zero, 100 ether);
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分
        payOrder(issuer, 100 ether, zero); 
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        payOrder(issuer, 100 ether, zero);
        appendStage(issuer, worker, 1, 100 ether, 86400, '');

        //驗收第一個阶段
        vm.warp(182800);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(other, 1, stageIndexs);
        stageIndexs=[0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)",1));
        refund(issuer, 1, issuer, 1 ether);
        assertEq(address(issuer).balance,800 ether);
        withdraw(worker, 1, worker);
        assertEq(address(worker).balance,95 ether);

        //验收第二个阶段
        vm.warp(1828000);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(worker, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        confirmDelivery(other, 1, stageIndexs);
        stageIndexs=[1];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)",1));
        refund(issuer, 1, issuer, 1 ether);
        assertEq(address(issuer).balance,800 ether);
        withdraw(worker, 1, worker);
        assertEq(address(worker).balance,190 ether);
    }


}                                