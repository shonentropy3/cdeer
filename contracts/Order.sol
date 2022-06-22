// pragma solidity ^0.8.0;

// import "./CodeMarket.sol";

// contract Order is CodeMarket{

//     uint256 private remainingTime;

//     mapping (uint256 => uint256) private _balances;
//     mapping(uint256 => uint8) private status;   

//     constructor() {

//     }

//     function createOrder(
//         uint256 _tokenId,
//         uint256 _monetaryAmount,
//         uint256 _timePeriod
//     )
//         external payable
//     {
//         remainingTime = _timePeriod;
//         require(condition);
//     }

//     function _status(uint256 _tokenId) public view returns (uint8) {
//         return status[_tokenId];
//     }    

//     function  modifyState(uint _tokenId,uint8 _status) public {
//         require(msg.sender == ownerOf(_tokenId), "No modification permission");
//         status[_tokenId] = _status;
//     } 

//     function acceptOrders

// }