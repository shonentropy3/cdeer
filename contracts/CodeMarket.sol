pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";


contract CodeMarket is ERC721Enumerable, Ownable{

    using SafeMath for uint256,uint8;
    using Counters for Counters.Counter;
    uint private fee;
    address private owner;

    event CreateProject(address indexed msgSenderAdddress, uint256 indexed tokenId, string title, uint budget, 
            string content, uint period); 

    struct ProjectContent{
        string title;
        uint budget;
        bytes32 content;  //
        uint period;
    }
    
    Counters.Counter private tokenIds;

    mapping(uint256 => ProjectContent) private projectContent; 
    mapping(uint => unit8) public  status;    
    mapping(uint => uint) private updateTimes;
    mapping(bytes32 => uint) private tokenIdByContent;
    
    constructor(address _owner) ERC721("Create NFT ProjectContent","CPC") {
        require(_owner != address(0), "Owner is a zero address");
        owner = _owner;
    }
    
    function createProject(ProjectContent memory _projectContent) external payable {
        require(msg.value > fee, "Not enough handling fee.");
        uint256 tokenId = tokenIds.current();        
        projectContent[tokenId] = ProjectContent({
            title: _projectContent.title,
            budget: _projectContent.budget,
            content: _projectContent.content,
            peroid: _projectContent.period
        });

        _safeMint(msg.sender, tokenId);
        status[tokenId] = 1;
        console.log("Invoke the address: ",msg.sender);
        tokenIds.increment();   

        console.log("tokenId:", tokenId);
        emit CreateProject(msg.sender, tokenId, _projectContent.title, _projectContent.budget, 
            _projectContent.content, _projectContent.period);
    }
    
    function modifyFee(uint memory _fee) public  {
        require(msg.sender == owner,"No right of modification.");
        fee = _fee;
    }

    function updateStatus(uint _tokenId,uint8 _status) public {
        require(msg.sender == _owners(_tokenId),"No right of modification.");
        require(_status < 5 && 1 == (_status - status(_tokenId)),"Status parameter error.");
        status(_tokenId) = _status;
    }

    function updateProject(ProjectContent memory _projectContent,uint _tokenId) public payable{
        require(msg.sender == _owners(_tokenId),"No right of modification.");
        require(0 == status(_tokenId),"Projects have been taken on order.");
        if(updateTimes(_tokenId)>3){
            require(msg.value > fee, "Not enough handling fee.");
        }
        projectContent[_tokenId] = ProjectContent({
            title: _projectContent.title,
            budget: _projectContent.budget,
            content: _projectContent.content,
            peroid: _projectContent.period
        });    
    }
  
}