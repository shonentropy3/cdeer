// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "contracts/DeOrder.sol";
import "contracts/DeStage.sol";
import "contracts/mock/WETH.sol";
import "contracts/libs/ECDSA.sol";
import "contracts/DeOrderVerifier.sol";
import {Utilities} from "./utils/Utilities.sol";
import {Permit2Sign} from "./utils/Permit2Sign.sol";
import {Permit2} from "permit2/Permit2.sol";
import {MockERC20} from "./mock/MockERC20.sol";
import {IPermit2} from "contracts/interface/IPermit2.sol";
import {Mock} from "./mock/mock.sol";

contract DeTaskTest is Test, Utilities, Permit2Sign {
    Mock internal mock;
    MockERC20 token0;
    Permit2 permit2;
    IPermit2 internal PERMIT2;
    DeOrder internal deOrder;
    DeOrderVerifier internal _verifier;
    DeStage internal deStage;
    WETH internal _weth;
    bytes32 DOMAIN_SEPARATOR;
    address owner; // 合约拥有者
    address issuer; // 甲方
    address worker; // 乙方
    address other; // 第三方
    error ParamError();

    // address _permit2 = 0x250182E0C0885e355E114f2FcCC03292aa6Ea2fC;

    function setUp() public {
        mock = new Mock();
        token0 = new MockERC20("Test0", "TEST0", 18);
        permit2 = new Permit2{salt: 0x00}();
        DOMAIN_SEPARATOR = permit2.DOMAIN_SEPARATOR();
        PERMIT2 = IPermit2(address(permit2));
        // 初始化用户地址
        owner = msg.sender;
        issuer = vm.addr(1);
        worker = vm.addr(2);
        other = vm.addr(3);

        vm.startPrank(owner); // 切换合约发起人
        _verifier = new DeOrderVerifier();
        _weth = new WETH();
        deOrder = new DeOrder(
            address(_weth),
            address(permit2),
            address(_verifier)
        );
        deStage = new DeStage(address(deOrder));
        vm.stopPrank();
        testSetDeStage(); // 设置DeStage地址
        // 打印信息
        console.log(owner);
        console.log(issuer);
        console.log(worker);
        token0.mint(issuer, 100 ** 18);
        vm.startPrank(issuer);
        token0.approve(address(permit2), type(uint256).max);
        vm.stopPrank();
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
        createOrder(); // 创建Order
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        // 非本人修改
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        deOrder.modifyOrder(1, address(0), 1);
        payOrder(issuer, 100); // 付款
        startOrder(issuer); // 开始任务
        // 任务已经开始修改
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        deOrder.modifyOrder(1, issuer, 1);
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
        // 甲方签名 && 甲方提交
        permitStage(issuer, issuer, "Due", "PermissionsError()");
        // 乙方签名 && 乙方提交
        permitStage(worker, worker, "Due", "PermissionsError()");
        // 乙方签名 && 其它人提交
        permitStage(worker, other, "Due", "PermissionsError()");
        // 其它人签名 && 乙方提交
        permitStage(other, worker, "Due", "PermissionsError()");
        // 任务已经开始 提交
        permitStage(worker, issuer, "Due", ""); // 正常划分阶段
        payOrder(issuer, 100); // 付款
        startOrder(issuer); // 开始任务
        permitStage(worker, issuer, "Due", "ProgressError()");
    }

    // permitStage
    // @Summary 阶段划分
    function permitStage(
        address sign,
        address submit,
        bytes memory payTypeString,
        string memory expectRevert
    ) public {
        uint256 _orderId = 1;
        uint256[] memory _amounts = new uint256[](1);
        uint256[] memory _periods = new uint256[](1);
        _amounts[0] = 100;
        PaymentType payType = PaymentType.Unknown;
        if (keccak256(payTypeString) == keccak256("Confirm")) {
            _periods[0] = 0;
            payType = PaymentType.Confirm;
        } else if (keccak256(payTypeString) == keccak256("Due")) {
            _periods[0] = 1;
            payType = PaymentType.Due;
        } else {
            revert ParamError();
        }
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                payType,
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
        if (!isStringEmpty(expectRevert)) {
            vm.expectRevert(abi.encodeWithSignature(expectRevert));
        }
        deOrder.permitStage(
            _orderId,
            _amounts,
            _periods,
            payType,
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
        permitStage(issuer, worker, "Due", "");
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assertTrue(order.progress == OrderProgess.Staged);
        assertEq(stages[0].amount, 100);
        assertEq(stages[0].period, 1);
        assertTrue(order.payType == PaymentType.Due); // 付款模式
        // 乙方签名 甲方提交
        permitStage(worker, issuer, "Confirm", "");
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
        uint256 nonce = _verifier.nonces(sign, 0);
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
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
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
        permitStage(worker, issuer, "Due", ""); // 阶段划分
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

    // appendStage
    // @Summary 添加阶段
    function appendStage(address sign, address submit) public {
        uint256 _orderId = 1;
        uint256 amount = 10;
        uint256 period = 10;
        uint256 nonce = _verifier.nonces(sign, 0);
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITAPPENDSTAGE_TYPEHASH(),
                _orderId,
                amount,
                period,
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
        deOrder.appendStage(_orderId, amount, period, nonce, deadline, v, r, s);
        vm.stopPrank();
    }

    //testCannotAppendStage
    // @Summary 添加阶段失败情况
    function testCannotAppendStage() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
        uint256 _orderId = 1;
        uint256 amount = 10;
        uint256 period = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITAPPENDSTAGE_TYPEHASH(),
                _orderId,
                amount,
                period,
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
        payOrder(issuer, 100); // 支付
        // 乙方调用
        vm.startPrank(worker);
        // 任务不在进行中
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        deOrder.appendStage(_orderId, amount, period, nonce, deadline, v, r, s);
        vm.stopPrank();
    }

    // testAppendStage
    // @Summary 测试添加阶段
    function testAppendStage() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Due", ""); // 阶段划分
        payOrder(issuer, 100); // 支付
        startOrder(issuer); // 开始任务
        uint256 _orderId = 1;
        uint256 amount = 100;
        uint256 period = 10;
        uint256 nonce = 0;
        uint256 deadline = 200;
        bytes32 structHash = keccak256(
            abi.encode(
                _verifier.PERMITAPPENDSTAGE_TYPEHASH(),
                _orderId,
                amount,
                period,
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
        payOrder(issuer, 100); // 支付
        // 乙方调用
        vm.startPrank(worker);
        deOrder.appendStage(_orderId, amount, period, nonce, deadline, v, r, s);
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
        createOrder(); // 创建Order
        // 阶段划分未完成
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        startOrder(issuer);
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        // 订单没有付款
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 1));
        startOrder(issuer);
        // 订单Amount和阶段Amount不等
        vm.startPrank(issuer);
        deOrder.modifyOrder(1, address(0), 1);
        vm.stopPrank();
        vm.expectRevert(abi.encodeWithSignature("AmountError(uint256)", 0));
        startOrder(issuer);
    }

    // testStartOrder
    // @Summary 开始任务
    function testStartOrder() public {
        testPermitStage();
        payOrder(issuer, 100); // 付款
        // 甲方调用
        startOrder(issuer);
        Order memory order = deOrder.getOrder(1);
        DeStage.Stage[] memory stages = deStage.getStages(1);
        assert(order.progress == OrderProgess.Ongoing);
        assert(stages[0].status == DeStage.StageStatus.Accepted);
    }

    // @Summary 付款
    function payOrder(address who, uint256 amount) public {
        vm.startPrank(who);
        vm.deal(who, amount);
        deOrder.payOrder{value: amount}(1, amount);
        vm.stopPrank();
    }

    // testPayOrder
    // @Summary 付款
    function testPayOrder() public {
        // 甲方付款
        payOrder(issuer, 1);
        Order memory order = deOrder.getOrder(1);
        console.log(order.payed);
    }

    // payOrderWithPermit2
    // @Summary 使用Permit2付款
    function payOrderWithPermit2(address who, uint256 amount) public {
        uint256 nonce = 0;
        IPermit2.PermitTransferFrom memory permit = defaultERC20PermitTransfer(
            address(token0),
            nonce
        );
        // 签名数据
        bytes memory sig = getPermitTransferSignature(
            permit,
            DOMAIN_SEPARATOR,
            address(deOrder)
        );
        vm.startPrank(who);
        deOrder.payOrderWithPermit2(1, amount, permit, sig);
        vm.stopPrank();
    }

    // testPayOrderWithPermit2
    // @Summary 测试使用Permit2付款
    function testPayOrderWithPermit2() public {
        vm.startPrank(owner);
        deOrder.setSupportToken(address(token0), true);
        vm.stopPrank();
        // 创建Order
        vm.startPrank(issuer); // 甲方
        deOrder.createOrder(64, issuer, worker, address(token0), 100);
        vm.stopPrank();
        console.log(deOrder.supportTokens(address(token0)));
        // 甲方付款
        payOrderWithPermit2(issuer, 1);
        Order memory order = deOrder.getOrder(1);
        assertEq(order.payed, 100);
    }

    // abortOrder
    // @Summary 中止任务
    function abortOrder(address who, uint256 _orderId) public {
        vm.startPrank(who);
        deOrder.abortOrder(_orderId);
        vm.stopPrank();
    }

    // testCannotAbortOrder
    // @Summary 中止任务失败情况
    function testCannotAbortOrder() public {
        createOrder(); // 创建Order
        // 状态不在Ongoing
        vm.expectRevert(abi.encodeWithSignature("ProgressError()"));
        abortOrder(issuer, 1); // 中止任务
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        payOrder(issuer, 100); // 付款
        startOrder(issuer); // 开始任务
        // 其它人调用合约中止
        vm.expectRevert(abi.encodeWithSignature("PermissionsError()"));
        abortOrder(other, 1);
    }

    // testCannotAbortOrder
    // @Summary 中止任务失败情况
    function testAbortOrder() public {
        createOrder(); // 创建Order
        permitStage(issuer, worker, "Due", ""); // 阶段划分
        payOrder(issuer, 100); // 付款
        startOrder(issuer); // 开始任务
        // 中止任务 已经完成的阶段和预付款 付款给乙方
        abortOrder(worker, 1);
    }

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
    // @Summary 测试甲方验收 和乙方提款
    function testcheckAndwithdraw() public {
        createOrder(); // 创建Order
        permitStage(worker, issuer, "Confirm", ""); // 许可阶段划分
        payOrder(issuer, 100); // 付款
        startOrder(issuer); // 开始任务
        checkAndwithdraw();
    }
}
