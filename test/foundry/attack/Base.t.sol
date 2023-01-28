import "forge-std/Test.sol";
import {WETH} from "contracts/mock/WETH.sol";
import {DeOrderTest} from "../DeOrder/DeOrder.t.sol";
import {DeOrder} from "contracts/DeOrder.sol";
import {DeOrderVerifier} from "contracts/DeOrderVerifier.sol";
import "contracts/libs/ECDSA.sol";
import "contracts/interface/IOrder.sol";

contract AttackBase is Test {
    DeOrder public deOrder;
    WETH public weth;
    DeOrderVerifier public verifier;
    address owner = msg.sender; // 合约拥有者
    address issuer = vm.addr(1); // 甲方
    address worker = vm.addr(2); // 乙方
    address other = vm.addr(3); // 第三方

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
        address submit,
        uint256 _orderId,
        uint256[] memory _amounts,
        uint256[] memory _periods,
        bytes memory payTypeString
    ) public {
        PaymentType payType = PaymentType.Unknown;
        if (keccak256(payTypeString) == keccak256("Confirm")) {
            payType = PaymentType.Confirm;
        } else if (keccak256(payTypeString) == keccak256("Due")) {
            payType = PaymentType.Due;
        }
        uint256 nonce = verifier.nonces(sign, _orderId);
        uint256 deadline = 200;
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
}
