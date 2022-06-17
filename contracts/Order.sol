pragma solidity ^0.8.0;

import "./CodeMarket.sol";

contract Order is CodeMarket{

    uint256 private remainingTime;

    mapping (uint256 => uint256) private _balances;
    mapping(uint256 => uint8) private state;   

    constructor() {

    }

    function createOrder(
        uint256 _tokenId,
        uint256 _monetaryAmount,
        uint256 _timePeriod
    )
        external payable
    {
        remainingTime = _timePeriod;
        require(condition);
    }

    function _state(uint256 _tokenId) public view returns (uint8) {
        return state[_tokenId];
    }    

    function  modifyState(uint _tokenId,uint8 _state) public {
        require(msg.sender == ownerOf(_tokenId), "No modification permission");
        state[_tokenId] = _state;
    } 

    function acceptOrders

}