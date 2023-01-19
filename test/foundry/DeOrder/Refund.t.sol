// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {DeOrderTest} from "./DeOrder.t.sol";
import "contracts/interface/IOrder.sol";
import "forge-std/console2.sol";

contract Refund is DeOrderTest {
    uint[] _stageIndexs = [0];

    // Due测试项目超时自动验收后甲乙双方正常取款和退款（没有测超时后项目的状态）
    function testDueRefundByTimeOutGetNormal() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        //创建order并阶段划分
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分

        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);

        payOrder(issuer, 200 ether, zero); // 付款

        //项目开始前issuer，worker，other调用refund方法
        refund(issuer, 1, issuer, 100 ether); //issuer退钱
        payOrder(issuer, 100 ether, zero); // 付款
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        assertEq(address(issuer).balance, 800 ether); //项目甲方余额

        //任務開始
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(100);

        //任務中調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 800 ether);
        //任务延期后调用
        prolongStage(issuer, worker, 1, 0, 1000, "");
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 800 ether);
        //增加階段
        appendStage(issuer, worker, 1, 100 ether, 4000, "");
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(100000);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 700 ether);

        // Order memory getordermsg=deOrder.getOrder(1);
        // // vm.expectRevert(bytes(""));
        //任務結束
        // Order memory getordermsg=deOrder.getOrder(1);
        // // vm.expectRevert(bytes(""));
        //任務結束
        vm.warp(1728000);
        //任務結束後調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);
        assertEq(address(issuer).balance, 800 ether);
        assertEq(address(_weth).balance, 200 ether);

        // console2.log(address(issuer).balance);
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // console2.log(address(owner).balance);
    }
    function testConfirmRefundByTimeOutGetNormal() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分

        payOrder(issuer, 200 ether, zero); // 付款

        //任務開始
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(100);

        //任務中調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 800 ether);
        //任务延期后调用
        prolongStage(issuer, worker, 1, 0, 1000, "");
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 800 ether);
        //增加階段
        appendStage(issuer, worker, 1, 100, 4000, "");
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(100000);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);
        payOrder(issuer, 100 ether, zero); // 付款
        assertEq(address(issuer).balance, 700 ether);

        stageIndexs = [0];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.warp(100000);
        //任務結束後調用此方法
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);
        assertEq(address(issuer).balance, 800 ether);
        assertEq(address(_weth).balance, 200 ether);
        payOrder(issuer, 100 ether, zero); // 付款
        stageIndexs = [1];
        confirmDelivery(issuer, 1, stageIndexs);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);
        assertEq(address(issuer).balance, 800 ether);
        assertEq(address(_weth).balance, 200 ether);

        // console2.log(address(issuer).balance);
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // console2.log(address(owner).balance);
    }

    //任務中斷取款
    function testDueissuerAbortOrderrefund() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分

        payOrder(issuer, 200 ether, zero); // 付款
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(86400);
        abortOrder(issuer, 1);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        // console2.log(address(issuer).balance);
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // console2.log(address(owner).balance);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);

    }

    function testConfirmIssuerAbortOrderrefund() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Confirm", ""); // 阶段划分

        payOrder(issuer, 200 ether, zero); // 付款
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务
        vm.warp(86400);
        abortOrder(issuer, 1);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(worker, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        refund(other, 1, issuer, 100 ether);
        // console2.log(address(issuer).balance);
        // console2.log(address(worker).balance);
        // console2.log(address(_weth).balance);
        // console2.log(address(owner).balance);
        refund(issuer, 1, issuer, 100 ether);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 100 ether);

    }

    //階段劃分後issuer提錢
    function testFailDueRefundByTimeOutGetNormal() public {
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, address(0), 100 ether); // 创建Order
        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分
        refund(issuer, 1, issuer, 100 ether);
    }

    //在各个阶段提取大于合约内的金钱
    function testRefundGreaterOrder() public{
        vm.deal(owner, 0 ether); // 初始化原生币余额
        createOrder(issuer, address(0), 100 ether); // 创建Order


        amounts = [100 ether]; //100块
        periods = [172800]; // 两天
        permitStage(issuer, worker, amounts, periods, "Due", ""); // 阶段划分

        payOrder(issuer, 200 ether, zero); // 付款


        // refund(issuer, 1, issuer, 120 ether);
        // assertEq(address(issuer).balance, 800 ether); //项目甲方余额

        // //任務開始
        vm.warp(0); //初始化时间
        startOrder(issuer); // 开始任务

        // 提取大于合约的金额
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 150 ether);
        // //任務中調用此方法
        // refund(issuer, 1, issuer, 100 ether);
        // payOrder(issuer, 100 ether, zero); // 付款
        // assertEq(address(issuer).balance, 800 ether);
        //任务延期后调用
        prolongStage(issuer, worker, 1, 0, 1000, "");
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 150 ether);
        
        assertEq(address(issuer).balance, 800 ether);
        // //增加階段
        appendStage(issuer, worker, 1, 100, 4000, "");
        payOrder(issuer, 100 ether, zero); // 付款
        vm.warp(100000);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1)); //多次調用
        refund(issuer, 1, issuer, 200 ether);
        assertEq(address(issuer).balance, 700 ether);


    }

}
