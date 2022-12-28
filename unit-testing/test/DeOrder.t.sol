// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/DeOrder.sol";
import "../src/DeStage.sol";
import "../src/mock/WETH.sol";
import "../src/libs/ECDSA.sol";
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
        // 甲方创建Task ，只能甲方创建此Task的Order
        vm.startPrank(issuer); // 甲方
        deOrder.createOrder(
            64,
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
        uint256[] memory _amounts = new uint256[](1);
        uint256[] memory _periods = new uint256[](1);
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
        uint256[] memory _amounts = new uint256[](1);
        uint256[] memory _periods = new uint256[](1);
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
        order = deOrder.getOrder(1);
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

    // testCannotPermitStage
    // @Summary 许可阶段划分失败情况
    function testCannotPermitStage() public {
        testCreateOrder();
        uint256 _orderId = 1;
        uint256[] memory _amounts = new uint256[](1);
        uint256[] memory _periods = new uint256[](1);
        _amounts[0] = 69;
        _periods[0] = 1889;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                deOrder.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            deOrder.DOMAIN_SEPARATOR(),
            structHash
        );
        // 甲方签名
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        // 甲方提交
        vm.startPrank(issuer);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.permitStage(
            _orderId,
            _amounts,
            _periods,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();

        // 乙方签名
        (v, r, s) = vm.sign(2, digest);
        // 乙方提交
        vm.startPrank(worker);
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.permitStage(
            _orderId,
            _amounts,
            _periods,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();

        // 其它人提交
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.permitStage(
            _orderId,
            _amounts,
            _periods,
            nonce,
            deadline,
            v,
            r,
            s
        );
        // TODO: 任务已经开始
    }

    // testPermitStage
    // @Summary 许可阶段划分
    function testPermitStage() public {
        testCreateOrder();
        uint256 _orderId = 1;
        uint256[] memory _amounts = new uint256[](1);
        uint256[] memory _periods = new uint256[](1);
        _amounts[0] = 69;
        _periods[0] = 1889;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                deOrder.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            deOrder.DOMAIN_SEPARATOR(),
            structHash
        );
        // 甲方签名
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        // 乙方提交
        vm.startPrank(worker);
        deOrder.permitStage(
            _orderId,
            _amounts,
            _periods,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, _amounts[0]);
        assertEq(stages[0].period, _periods[0]);
        assertTrue(order.payType == PaymentType.Due); // 付款模式
        // 乙方签名
        _amounts[0] = 100;
        _periods[0] = 0;
        nonce = 0; // 乙方Nonce
        structHash = keccak256(
            abi.encode(
                deOrder.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                nonce,
                deadline
            )
        );
        digest = ECDSA.toTypedDataHash(deOrder.DOMAIN_SEPARATOR(), structHash);
        (v, r, s) = vm.sign(2, digest);
        // 甲方提交
        vm.startPrank(issuer);
        deOrder.permitStage(
            _orderId,
            _amounts,
            _periods,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();
        order = deOrder.getOrder(1);
        stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, _amounts[0]);
        assertEq(stages[0].period, _periods[0]);
        assertTrue(order.payType == PaymentType.Confirm); // 付款模式
    }

    // testCannotProlongStage
    // @Summary 延长阶段失败情况
    function testCannotProlongStage() public {
        testPermitStage();
        uint256 _orderId = 1;
        uint _stageIndex = 0;
        uint _appendPeriod = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                deOrder.PERMITPROSTAGE_TYPEHASH(),
                _orderId,
                _stageIndex,
                _appendPeriod,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            deOrder.DOMAIN_SEPARATOR(),
            structHash
        );
        // 甲方签名
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        // 乙方调用
        vm.startPrank(worker);
        // 任务不在进行中
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        deOrder.prolongStage(
            _orderId,
            _stageIndex,
            _appendPeriod,
            nonce,
            deadline,
            v,
            r,
            s
        );
        vm.stopPrank();
        // TODO:任务进行中
    }

    // testProlongStage
    // @Summary 延长阶段
    function testProlongStage() public {
        testPermitStage();
        uint256 _orderId = 1;
        uint _stageIndex = 0;
        uint _appendPeriod = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                deOrder.PERMITPROSTAGE_TYPEHASH(),
                _orderId,
                _stageIndex,
                _appendPeriod,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            deOrder.DOMAIN_SEPARATOR(),
            structHash
        );
        // 甲方签名
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        // 乙方调用
        deOrder.prolongStage(
            _orderId,
            _stageIndex,
            _appendPeriod,
            nonce,
            deadline,
            v,
            r,
            s
        );
    }

    // testStartOrder
    // @Summary 开始任务
    function testCannotStartOrder() public {
        // testPermitStage();
        // testModifyOrder();
        testSetStage();
        testPermitStage();
        // 乙方调用
        vm.startPrank(worker);
        deOrder.startOrder(1);
        vm.stopPrank();
    }

    // testStartOrder
    // @Summary 开始任务
    function testStartOrder() public {
        // testPermitStage();
        // testModifyOrder();
        testSetStage();
        testPermitStage();
        // 乙方调用
        vm.startPrank(issuer);
        deOrder.startOrder(1);
        vm.stopPrank();
    }
}
