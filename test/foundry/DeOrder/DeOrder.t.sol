// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "contracts/DeOrder.sol";
import "contracts/DeStage.sol";
import "contracts/mock/WETH.sol";
import "contracts/libs/ECDSA.sol";
import "contracts/DeOrderVerifier.sol";
import {Utilities} from "../utils/Utilities.sol";
import {Permit2Sign} from "../utils/Permit2Sign.sol";
import {Permit2} from "permit2/Permit2.sol";
import {MockERC20} from "../mock/MockERC20.sol";
import {IPermit2} from "contracts/interface/IPermit2.sol";

contract DeOrderTest is Test, Utilities, Permit2Sign {
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
    address zero = address(0);

    uint[] amounts = [50, 50];
    uint[] periods = [1000,1000];
    error ParamError();
    event SupportToken(address token, bool enabled);
    event OrderModified(uint indexed orderId, address token, uint amount);

    // address _permit2 = 0x250182E0C0885e355E114f2FcCC03292aa6Ea2fC;
    function setUp() public {
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
        token0.approve(address(permit2), type(uint256).max); // 授权
        token0.approve(address(deOrder), type(uint256).max); // 授权
        vm.stopPrank();
        vm.deal(issuer, 1000 ether); // 初始化原生币余额
    }

    // createOrder
    // @Summary 创建Order
    function createOrder(address who, address _token, uint _amount) public {
        vm.startPrank(who); // 甲方
        deOrder.createOrder(64, issuer, worker, address(_token), _amount);
        vm.stopPrank();
    }

    // modifyOrder
    // @Summary 修改Order
    function modifyOrder(
        address who,
        uint orderId,
        address token,
        uint amount
    ) public {
        vm.startPrank(who);
        vm.expectEmit(true, false, false, true);
        emit OrderModified(orderId, token, amount);
        deOrder.modifyOrder(orderId, token, amount);
        vm.stopPrank();
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

    // permitStage
    // @Summary 阶段划分
    function permitStage(
        address sign,
        address submit,
        uint256[] memory _amounts,
        uint256[] memory _periods,
        bytes memory payTypeString,
        string memory expectRevert
    ) public {
        uint256 _orderId = 1;
        PaymentType payType = PaymentType.Unknown;
        if (keccak256(payTypeString) == keccak256("Confirm")) {
            payType = PaymentType.Confirm;
        } else if (keccak256(payTypeString) == keccak256("Due")) {
            payType = PaymentType.Due;
        } else {
            revert ParamError();
        }
        uint256 nonce = _verifier.nonces(sign, _orderId);
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

    function prolongStage(address sign, address submit) public {
        uint256 _orderId = 1;
        uint256 _stageIndex = 0;
        uint256 _appendPeriod = 10;
        uint256 nonce = _verifier.nonces(sign, _orderId);
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

    // appendStage
    // @Summary 添加阶段
    function appendStage(
        address sign,
        address submit,
        string memory expectRevert
    ) public {
        uint256 _orderId = 1;
        uint256 amount = 10;
        uint256 period = 10;
        uint256 nonce = _verifier.nonces(sign, _orderId);
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
        if (!isStringEmpty(expectRevert)) {
            vm.expectRevert(abi.encodeWithSignature(expectRevert));
        }
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

    // @Summary 付款
    function payOrder(address who, uint256 amount, address _token) public {
        vm.startPrank(who);
        if (_token == address(0)) {
            deOrder.payOrder{value: amount}(1, amount);
        } else {
            deOrder.payOrder(1, amount);
        }
        vm.stopPrank();
    }

    // abortOrder
    // @Summary 中止任务
    function abortOrder(address who, uint256 _orderId) public {
        vm.startPrank(who);
        deOrder.abortOrder(_orderId);
        vm.stopPrank();
    }

    //
    function setSupportToken(address who, address _token, bool enable) public {
        vm.startPrank(who); // 乙方
        vm.expectEmit(false, false, false, true);
        emit SupportToken(address(_token), enable);
        deOrder.setSupportToken(_token, enable);
        vm.stopPrank();
    }

    function testsetSupportToken() public {
        setSupportToken(owner, address(token0), true);
    }
}
