//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "./SBTBase.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract IssuerSBT is SBTBase, Ownable {

    error InvalidCaller();

    address public deOrder;

    event SetDeorder(address deorder);

    constructor(address _order) SBTBase("DeTask Issuer", "Issuer") {
        deOrder = _order; 
        emit SetDeorder(_order);
    }


    modifier onlyDeorder() {
        if(msg.sender != deOrder) revert InvalidCaller(); 
        _;
    }

    function mint(uint orderId) external onlyDeorder {
        Order memory order = IOrder(deOrder).getOrder(orderId);
        _mint(order.issuer, orderId);
    }


    function setDeOrder(address _deOrder) external onlyOwner {
        deOrder = _deOrder;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "";
    }
}