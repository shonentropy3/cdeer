//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IOrder.sol";
import "./SBTBase.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract BuilderSBT is SBTBase, Ownable {

    error InvalidCaller();

    address public deOrder;

    event SetDeorder(address deorder);

    constructor(address _order) SBTBase("DeTask Builder", "Builder") {
        deOrder = _order; 
        emit SetDeorder(_order);
    }


    modifier onlyDeorder() {
        if(msg.sender != deOrder) revert InvalidCaller(); 
        _;
    }

    // 
    function mint(address who, uint orderId) external onlyDeorder {
        _mint(who, orderId);
    }


    function setDeOrder(address _deOrder) external onlyOwner {
        deOrder = _deOrder;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return "";
    }
}