//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IStage {
  function setStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external;
  function checkStage(uint _orderId, uint[] memory _amounts, uint[] memory _periods) external returns (bool);
  function totalAmount(uint orderId) external view returns(uint total);
  function startOrder(uint _orderId) external;
  function withdrawStage(uint _orderId, uint _nextStage) external;
  function confirmStage(uint _orderId, uint _stageIndex) external;
  function abortOrder(uint _orderId, bool issuerAbort) external returns(uint currStageIndex, uint issuerAmount, uint workerAmount);
  function pendingWithdraw(uint _orderId) external view returns (uint pending, uint nextStage);
}