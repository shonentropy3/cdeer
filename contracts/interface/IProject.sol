pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


interface IProject is IERC721 {

    function setOrder(address) external;



}