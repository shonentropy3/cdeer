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
    
    Counters.Counter private _tokenIds;

    mapping(uint256 => ProjectContent) _projectContent;
    
    mapping(uint256 => uint8) state;    

    constructor() ERC721("Create NFT ProjectContent","CPC") {

    }
    

    function createProject(ProjectContent memory projectContent_) external payable{
        require(projectContent_.price >= 0, "The price cannot be negative.");
        uint256 tokenId = _tokenIds.current();        
        _projectContent[tokenId] = ProjectContent({
            title: projectContent_.title,
            price: projectContent_.price,
            content: projectContent_.content,
            time: projectContent_.time
        });

        _safeMint(msg.sender, tokenId);
        state[tokenId] = 0;
        console.log("Invoke the address: ",msg.sender);
        _tokenIds.increment();   

        console.log("tokenId:", tokenId);
        emit CreateProject(msg.sender, tokenId, projectContent_.title, projectContent_.price, 
            projectContent_.content, projectContent_.time);
    }
    
    
    function tokensAmount(address _account) external view returns (uint) {

        uint tokenCount = balanceOf(_account);

        return tokenCount;
    }
    

    function  modifyState(uint _tokenId,uint8 _state) external {
        // require(msg.sender == (ERC721)._owners[_tokenId], "No modification permission");
        state[_tokenId] = _state;
    }    
  
}