import "forge-std/Test.sol";
import {DeOrder} from "contracts/DeOrder.sol";
import {WETH} from "contracts/mock/WETH.sol";
import {DeOrderTest} from "../DeOrder/DeOrder.t.sol";
import {AttackBase} from "./Base.t.sol";
import {DeOrderVerifier} from "contracts/DeOrderVerifier.sol";
import "contracts/libs/ECDSA.sol";
import "contracts/interface/IOrder.sol";
contract AttackWithdraw is Test {
    DeOrder public deOrder;
    WETH public weth;
    DeOrderVerifier public verifier;
    address owner = msg.sender; // 合约拥有者
    address issuer = vm.addr(1); // 甲方
    address worker = vm.addr(2); // 乙方
    address other = vm.addr(3); // 第三方
    uint[] amounts = [50, 50];
    uint[] periods = [1000, 1000];

    // 初始化Bank合约地址
    constructor(DeOrder _deOrder, WETH _weth, DeOrderVerifier _verifier) {
        deOrder = _deOrder;
        weth = _weth;
        verifier = _verifier;
    }

    // permitStage
    // @Summary 阶段划分
    function permitStage(
        address sign,
        uint256 _orderId,
        uint256[] memory _amounts,
        uint256[] memory _periods
    ) public {
        PaymentType payType = PaymentType.Due;
        uint256 nonce = verifier.nonces(sign, _orderId);
        uint256 deadline = 20000;
        bytes32 structHash = keccak256(
            abi.encode(
                verifier.PERMITSTAGE_TYPEHASH(),
                _orderId,
                keccak256(abi.encodePacked(_amounts)),
                keccak256(abi.encodePacked(_periods)),
                payType,
                nonce,
                deadline
            )
        );
        bytes32 digest = ECDSA.toTypedDataHash(
            verifier.DOMAIN_SEPARATOR(),
            structHash
        );
        // 签名
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = vm.sign(2, digest);
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
    }

    receive() external payable {}

    // receive() external payable {
    //     if (weth.totalSupply() >= 1 ether) {
    //         deOrder.withdraw(2, address(this));
    //     }
    // }

    // 攻击函数
    function attack() external payable {
        deOrder.createOrder(0, address(this), worker, address(0), 100);
        // amounts = [100]; //100块
        // periods = [172800]; // 两天
        permitStage(worker, 2, amounts, periods); // 阶段划分
        // deOrder.payOrder{value: 1 ether}(2, 1 ether); // 付款
        // vm.warp(0); //初始化时间
        // startOrder(address(this)); // 开始任务
        // vm.warp(1728000); //初始化时间
        // deOrder.withdraw(2, address(this));
    }
}
