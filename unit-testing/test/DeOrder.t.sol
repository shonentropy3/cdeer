// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/DeOrder.sol";
import "../src/DeStage.sol";
import "../src/mock/WETH.sol";
import "../src/libs/ECDSA.sol";
import "../src/DeOrderVerifier.sol";
import {Mock} from "./mock/mock.sol";

contract DeTaskTest is Test {
    Mock internal mock;
    DeOrder internal deOrder;
    DeOrderVerifier internal _verifier;
    DeStage internal deStage;
    WETH internal _weth;
    address owner; // 合约拥有者
    address issuer; // 甲方
    address worker; // 乙方
    address other; // 第三方
    address _permit2 = 0x250182E0C0885e355E114f2FcCC03292aa6Ea2fC;

    function setUp() public {
        mock = new Mock();
        // 初始化用户地址
        owner = msg.sender;
        issuer = vm.addr(1);
        worker = vm.addr(2);
        other = vm.addr(3);

        vm.startPrank(owner); // 切换合约发起人
        _verifier = new DeOrderVerifier();
        _weth = new WETH();
        deOrder = new DeOrder(address(_weth), _permit2, address(_verifier));
        deStage = new DeStage(address(deOrder));
        vm.stopPrank();
        testSetDeStage(); // 设置DeStage地址
        // 打印信息
        console.log(owner);
        console.log(issuer);
        console.log(worker);
    }

    // createOrder
    // @Summary 创建Order
    function createOrder() public {
        vm.startPrank(issuer); // 甲方
        deOrder.createOrder(64, issuer, worker, address(0), 100);
        vm.stopPrank();
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
        // 不允许的币种
        vm.expectRevert(abi.encodeWithSignature("UnSupportToken()"));
        deOrder.createOrder(
            1,
            issuer,
            worker,
            address(0x69BB456f9181C798f6B31149004a5A1ADfAd241B),
            1
        );
    }

    // testCreateOrder
    // @Summary 测试创建Order
    function testCreateOrder() public {
        // 甲方创建Task ，只能甲方创建此Task的Order
        createOrder(); // 创建Order
        Order memory order = deOrder.getOrder(1);
        assertEq(order.issuer, issuer);
        assertEq(order.worker, worker);
        assertEq(order.token, address(0));
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
        createOrder(); // 创建Order
        vm.startPrank(issuer); // 甲方
        deOrder.modifyOrder(1, address(0), 1);
        vm.stopPrank();
        Order memory order = deOrder.getOrder(1);
        assertEq(order.token, address(0));
        assertEq(order.amount, 1);
        // TODO: 更换token退款
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
        createOrder(); // 创建Order
        uint256 _orderId = 1;
        uint256[] memory _amounts = new uint256[](1);
        uint256[] memory _periods = new uint256[](1);
        _amounts[0] = 69;
        _periods[0] = 1889;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
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

    // permitStage
    // @Summary 阶段划分
    function permitStage(
        address sign,
        address submit,
        bytes memory payType
    ) public {
        uint256 _orderId = 1;
        uint256[] memory _amounts = new uint256[](1);
        uint256[] memory _periods = new uint256[](1);
        _amounts[0] = 100;
        if (keccak256(payType) == keccak256("Confirm")) {
            _periods[0] = 0;
        } else if (keccak256(payType) == keccak256("Due")) {
            _periods[0] = 1;
        }
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
            structHash
        );
        // 签名
        uint8 v;
        bytes32 r;
        bytes32 s;
        if (sign == issuer) {
            (v, r, s) = vm.sign(1, digest);
        } else if (sign == worker) {
            (v, r, s) = vm.sign(2, digest);
        } else {
            (v, r, s) = vm.sign(3, digest);
        }
        // 提交
        vm.startPrank(submit);
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
    }

    // testPermitStage
    // @Summary 阶段划分
    function testPermitStage() public {
        createOrder(); // 创建Order
        // 甲方签名 乙方提交
        permitStage(issuer, worker, "Due");
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, 100);
        assertEq(stages[0].period, 1);
        assertTrue(order.payType == PaymentType.Due); // 付款模式
        // 乙方签名 甲方提交
        permitStage(worker, issuer, "Confirm");
        order = deOrder.getOrder(1);
        stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, 100);
        assertEq(stages[0].period, 0);
        assertTrue(order.payType == PaymentType.Confirm); // 付款模式
    }

    function prolongStage(address sign, address submit) public {
        uint256 _orderId = 1;
        uint256 _stageIndex = 0;
        uint256 _appendPeriod = 10;
        uint256 nonce = _verifier.nonces(sign);
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITPROSTAGE_TYPEHASH(),
                _orderId,
                _stageIndex,
                _appendPeriod,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
            structHash
        );
      // 签名
        uint8 v;
        bytes32 r;
        bytes32 s;
        if (sign == issuer) {
            (v, r, s) = vm.sign(1, digest);
        } else if (sign == worker) {
            (v, r, s) = vm.sign(2, digest);
        } else {
            (v, r, s) = vm.sign(3, digest);
        }
        // 调用
        vm.startPrank(submit);
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
    }

    // testCannotProlongStage
    // @Summary 延长阶段失败情况
    function testCannotProlongStage() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm"); // 许可阶段划分
        uint256 _orderId = 1;
        uint256 _stageIndex = 0;
        uint256 _appendPeriod = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITPROSTAGE_TYPEHASH(),
                _orderId,
                _stageIndex,
                _appendPeriod,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
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
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Due"); // 阶段划分
        payOrder(issuer, 100); // 支付
        startOrder(issuer); // 开始任务
        uint256 _orderId = 1;
        uint256 _stageIndex = 0;
        uint256 _appendPeriod = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITPROSTAGE_TYPEHASH(),
                _orderId,
                _stageIndex,
                _appendPeriod,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            _verifier.DOMAIN_SEPARATOR(),
            structHash
        );
        // 甲方签名
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, digest);
        // 乙方调用
        vm.startPrank(worker);
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
    }

    // startOrder
    // @Summary 开始任务
    function startOrder(address who) public {
        vm.startPrank(who);
        deOrder.startOrder(1);
        vm.stopPrank();
    }

    // testCannotStartOrder
    // @Summary 开始任务
    function testCannotStartOrder() public {
        testPermitStage();
        // 乙方调用
        vm.startPrank(worker);
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1));
        deOrder.startOrder(1);
        vm.stopPrank();
    }

    // testStartOrder
    // @Summary 开始任务
    function testStartOrder() public {
        testPermitStage();
        testPayOrder();
        // 甲方调用
        startOrder(issuer);
    }

    // @Summary 付款
    function payOrder(address who, uint amount) public {
        // 甲方付款
        vm.startPrank(who);
        vm.deal(who, amount);
        deOrder.payOrder{value: amount}(1, amount);
        vm.stopPrank();
    }

    function testPayOrder() public {
        // 甲方付款
        payOrder(issuer, 1);
        Order memory order = deOrder.getOrder(1);
        console.log(order.payed);
    }
}
