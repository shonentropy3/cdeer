pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";


contract CodeMarket is ERC721, Ownable{

    using SafeMath for uint256;
    using Counters for Counters.Counter;

    event CreateProject(address indexed msgSenderAdddress, uint256 indexed tokenId, string title, uint price, 
            string content, uint time); 

    struct ProjectContent{
        string title;
        uint price;
        string content;
        uint time;
    }
    
    Counters.Counter private tokenIds;

    mapping(uint256 => ProjectContent) projectContent;
    
    mapping(uint256 => uint8) state;    

    constructor() ERC721("Create NFT ProjectContent","CPC") {

    }
    
    function createProject(ProjectContent memory _projectContent) external payable{
        require(_projectContent.price >= 0, "The price cannot be negative.");
        uint256 tokenId = tokenIds.current();        
        projectContent[tokenId] = ProjectContent({
            title: _projectContent.title,
            price: _projectContent.price,
            content: _projectContent.content,
            time: _projectContent.time
        });

        _safeMint(msg.sender, tokenId);
        state[tokenId] = 0;
        console.log("Invoke the address: ",msg.sender);
        tokenIds.increment();   

        console.log("tokenId:", tokenId);
        emit CreateProject(msg.sender, tokenId, _projectContent.title, _projectContent.price, 
            _projectContent.content, _projectContent.time);
    }
    
    
    function tokensAmount(address _account) public view returns (uint256) {
        uint tokenCount = balanceOf(_account);
        console.log("tokenCount",tokenCount);
        return tokenCount;
    }
    
    function state(uint256 _tokentd) public view returns (uint8) {
        return state[_tokentd];
    }
    
    function  modifyState(uint _tokenId,uint8 _state) external {
        require(msg.sender == _owners[_tokenId], "No modification permission");
        state[_tokenId] = _state;
    }    
  
}