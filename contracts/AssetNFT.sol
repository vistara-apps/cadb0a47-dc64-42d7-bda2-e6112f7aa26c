// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AssetNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    struct Asset {
        uint256 tokenId;
        address creator;
        string name;
        string description;
        string assetType; // "image", "video", "audio"
        string ipfsHash;
        uint256 royaltyPercentage; // in basis points (e.g., 500 = 5%)
        uint256 createdAt;
        bool isListed;
        uint256 price;
    }

    mapping(uint256 => Asset) public assets;
    mapping(address => uint256[]) public creatorAssets;
    uint256 private _nextTokenId;

    event AssetMinted(uint256 indexed tokenId, address indexed creator, string assetType);
    event AssetListed(uint256 indexed tokenId, uint256 price);
    event AssetUnlisted(uint256 indexed tokenId);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed recipient, uint256 amount);

    constructor() ERC721("PixelForge Asset", "PXLA") Ownable(msg.sender) {}

    function mintAsset(
        string memory name,
        string memory description,
        string memory assetType,
        string memory ipfsHash,
        uint256 royaltyPercentage
    ) external returns (uint256) {
        require(royaltyPercentage <= 10000, "Royalty percentage too high"); // Max 100%

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);

        assets[tokenId] = Asset({
            tokenId: tokenId,
            creator: msg.sender,
            name: name,
            description: description,
            assetType: assetType,
            ipfsHash: ipfsHash,
            royaltyPercentage: royaltyPercentage,
            createdAt: block.timestamp,
            isListed: false,
            price: 0
        });

        creatorAssets[msg.sender].push(tokenId);

        emit AssetMinted(tokenId, msg.sender, assetType);
        return tokenId;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _setTokenURI(tokenId, _tokenURI);
    }

    function listAsset(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");

        assets[tokenId].isListed = true;
        assets[tokenId].price = price;

        emit AssetListed(tokenId, price);
    }

    function unlistAsset(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");

        assets[tokenId].isListed = false;
        assets[tokenId].price = 0;

        emit AssetUnlisted(tokenId);
    }

    function getAsset(uint256 tokenId) external view returns (Asset memory) {
        return assets[tokenId];
    }

    function getCreatorAssets(address creator) external view returns (uint256[] memory) {
        return creatorAssets[creator];
    }

    function calculateRoyalty(uint256 tokenId, uint256 salePrice) public view returns (uint256) {
        Asset memory asset = assets[tokenId];
        return (salePrice * asset.royaltyPercentage) / 10000;
    }

    function payRoyalty(uint256 tokenId, uint256 salePrice) external payable nonReentrant {
        Asset memory asset = assets[tokenId];
        uint256 royaltyAmount = calculateRoyalty(tokenId, salePrice);

        require(msg.value >= royaltyAmount, "Insufficient royalty payment");

        payable(asset.creator).transfer(royaltyAmount);

        emit RoyaltyPaid(tokenId, asset.creator, royaltyAmount);
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
            assets[tokenId].isListed = false;
            assets[tokenId].price = 0;
        }
        return super._update(to, tokenId, auth);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}

