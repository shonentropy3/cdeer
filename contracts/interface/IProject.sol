pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


interface IProject is IERC721 {

    function initOrder(address) external

    //创建项目
    event CreateProject(address indexed msgSender, uint indexed tokenId, string title, uint budget, 
            string indexed desc, uint period); 
    //项目报名
    event  ApplyProject(address indexed msg.sender, uint indexed _proId);

}