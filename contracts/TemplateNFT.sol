// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TemplateNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    struct Template {
        uint256 tokenId;
        address creator;
        string name;
        string description;
        string previewUrl;
        string layoutConfig; // JSON string with template configuration
        uint256 royaltyPercentage;
        uint256 createdAt;
        bool isListed;
        uint256 price;
        uint256 usageCount;
    }

    mapping(uint256 => Template) public templates;
    mapping(address => uint256[]) public creatorTemplates;
    uint256 private _nextTokenId;

    event TemplateMinted(uint256 indexed tokenId, address indexed creator);
    event TemplateListed(uint256 indexed tokenId, uint256 price);
    event TemplateUnlisted(uint256 indexed tokenId);
    event TemplateUsed(uint256 indexed tokenId, address indexed user);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed recipient, uint256 amount);

    constructor() ERC721("PixelForge Template", "PXLT") Ownable(msg.sender) {}

    function mintTemplate(
        string memory name,
        string memory description,
        string memory previewUrl,
        string memory layoutConfig,
        uint256 royaltyPercentage
    ) external returns (uint256) {
        require(royaltyPercentage <= 10000, "Royalty percentage too high");

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);

        templates[tokenId] = Template({
            tokenId: tokenId,
            creator: msg.sender,
            name: name,
            description: description,
            previewUrl: previewUrl,
            layoutConfig: layoutConfig,
            royaltyPercentage: royaltyPercentage,
            createdAt: block.timestamp,
            isListed: false,
            price: 0,
            usageCount: 0
        });

        creatorTemplates[msg.sender].push(tokenId);

        emit TemplateMinted(tokenId, msg.sender);
        return tokenId;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _setTokenURI(tokenId, _tokenURI);
    }

    function listTemplate(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");

        templates[tokenId].isListed = true;
        templates[tokenId].price = price;

        emit TemplateListed(tokenId, price);
    }

    function unlistTemplate(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");

        templates[tokenId].isListed = false;
        templates[tokenId].price = 0;

        emit TemplateUnlisted(tokenId);
    }

    function useTemplate(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Template does not exist");

        templates[tokenId].usageCount++;

        emit TemplateUsed(tokenId, msg.sender);
    }

    function getTemplate(uint256 tokenId) external view returns (Template memory) {
        return templates[tokenId];
    }

    function getCreatorTemplates(address creator) external view returns (uint256[] memory) {
        return creatorTemplates[creator];
    }

    function calculateRoyalty(uint256 tokenId, uint256 usageFee) public view returns (uint256) {
        Template memory template = templates[tokenId];
        return (usageFee * template.royaltyPercentage) / 10000;
    }

    function payRoyalty(uint256 tokenId, uint256 usageFee) external payable nonReentrant {
        Template memory template = templates[tokenId];
        uint256 royaltyAmount = calculateRoyalty(tokenId, usageFee);

        require(msg.value >= royaltyAmount, "Insufficient royalty payment");

        payable(template.creator).transfer(royaltyAmount);

        emit RoyaltyPaid(tokenId, template.creator, royaltyAmount);
    }

    // Override functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            // Transfer occurred, reset listing
            templates[tokenId].isListed = false;
            templates[tokenId].price = 0;
        }
        return super._update(to, tokenId, auth);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

