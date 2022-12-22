//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IMetaComm {
    function skills(uint i) external view returns (string memory);
    function skillAttributes(uint48 taskskills, uint i) external view returns (string memory);
    function dateTime(uint ts) external view returns (string memory datatime);
    function humanValue(uint taskbudget, uint8 currency) external view returns (string memory budget);
    function humanValueToken(uint amount, address token) external view returns (string memory budget);
}