// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/DeOrder.sol";
import "../src/DeStage.sol";
import "../src/mock/WETH.sol";
import {Mock} from "./mock/mock.sol";

contract DeTaskTest is Test {
    Mock internal mock;
    DeOrder internal deOrder;
    DeStage internal deStage;
    WETH internal _weth;
    address owner; // 合约拥有者
    address issuer; // 甲方
    address worker; // 乙方

    function setUp() public {
        mock = new Mock();
        // 初始化用户地址
        owner = msg.sender;
        issuer = vm.addr(1);
        worker = vm.addr(2);

        vm.startPrank(owner); // 切换合约发起人
        _weth = new WETH();
        deOrder = new DeOrder(address(_weth));
        deStage = new DeStage(address(deOrder));
        vm.stopPrank();
        testSetDeStage(); // 设置DeStage地址
        // 打印信息
        console.log(owner);
        console.log(issuer);
        console.log(worker);
    }

    // testCannotCreateOrder
    // @Summary 创建Order失败情况
    function testCannotCreateOrder() public {
        // issuer address is 0
        vm.expectRevert(abi.encodeWithSignature("ParamError()"));
        deOrder.createOrder(1, address(0), worker, address(0), 1);
        // worker address is 0
        vm.expectRevert(abi.encodeWithSignature("ParamError()"));
        deOrder.createOrder(1, issuer, address(0), address(0), 1);
        // issuer == worker
        vm.expectRevert(abi.encodeWithSignature("ParamError()"));
        deOrder.createOrder(1, issuer, issuer, address(0), 1);
    }

    // testCreateOrder
    // @Summary 创建Order
    function testCreateOrder() public {
        vm.startPrank(issuer); // 甲方
        deOrder.createOrder(
            1,
            issuer,
            worker,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B),
            100
        );
        vm.stopPrank();
        Order memory order = deOrder.getOrder(1);
        assertEq(order.issuer, issuer);
        assertEq(order.worker, worker);
        assertEq(
            order.token,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B)
        );
        assertEq(order.amount, 100);
        assertTrue(order.payType == PaymentType.Unknown);
        assertTrue(order.progress == OrderProgess.Init);
        assertEq(order.startDate, 0);
        assertEq(order.payed, 0);
    }

    // testCannotModifyOrder
    // @Summary 修改Order失败情况
    function testCannotModifyOrder() public {
        // 非本人修改
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.modifyOrder(1, address(0), 1);
        // TODO: 任务已经开始修改
    }

    // testModifyOrder
    // @Summary 修改Order
    function testModifyOrder() public {
        testCreateOrder();
        vm.startPrank(issuer); // 甲方
        deOrder.modifyOrder(1, address(0), 1);
        vm.stopPrank();
        Order memory order = deOrder.getOrder(1);
        assertEq(order.token, address(0));
        assertEq(order.amount, 1);
        // TODO: 更换token退款
    }

    // testCannotSetStage
    // @Summary 设置阶段失败情况
    function testCannotSetStage() public {
        uint[] memory _amounts = new uint[](1);
        uint[] memory _periods = new uint[](1);
        _amounts[0] = 1;
        _periods[0] = 1;
        // 非甲方或乙方修改
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.setStage(1, _amounts, _periods);
        // TODO: 任务已经开始修改
    }

    // testSetStage
    // @Summary 设置阶段
    function testSetStage() public {
        testCreateOrder();
        uint[] memory _amounts = new uint[](1);
        uint[] memory _periods = new uint[](1);
        _amounts[0] = 1;
        _periods[0] = 1;
        // 甲方修改
        vm.startPrank(issuer); // 甲方
        deOrder.setStage(1, _amounts, _periods);
        vm.stopPrank();
        Order memory order = deOrder.getOrder(1);
        assertTrue(order.progress == OrderProgess.StagingByIssuer);
        // 乙方修改
        vm.startPrank(worker); // 乙方
        deOrder.setStage(1, _amounts, _periods);
        vm.stopPrank();
        order = deOrder.getOrder(1);
        assertTrue(order.progress == OrderProgess.StagingByWoker);
        // 付款模式：到期自动付款 && 经过甲方确认
        assertTrue(order.payType == PaymentType.Due);
        _periods[0] = 0;
        vm.startPrank(issuer); // 甲方
        deOrder.setStage(1, _amounts, _periods);
        vm.stopPrank();
        assertTrue(order.payType == PaymentType.Confirm);
    }

    // testSetDeStage
    // @Summary 设置DeStage合约地址
    function testSetDeStage() public {
        vm.startPrank(owner);
        deOrder.setDeStage(address(deStage));
        vm.stopPrank();
        assertEq(deOrder.stage(), address(deStage));
    }

    // testCannotSetDeStage
    // @Summary 非合约创建者设置DeStage合约地址 && 设置DeStage合约地址为 零地址
    function testCannotSetDeStage() public {
        // 非合约创建者设置order合约地址
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        deOrder.setDeStage(address(deStage));
    }
}
