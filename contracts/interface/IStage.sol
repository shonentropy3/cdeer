//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IStage {
  function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods, string memory _attachment) external;
  function totalAmount(uint orderId) external view returns(uint total);
  function startOrder(uint _orderId) external;
  function withdrawStage(uint _orderId, uint _nextStage) external;
}