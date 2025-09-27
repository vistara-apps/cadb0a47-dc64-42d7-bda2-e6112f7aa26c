// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./AssetNFT.sol";
import "./TemplateNFT.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    struct Listing {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
        uint256 listedAt;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => uint256[]) public userListings;

    uint256 public platformFee = 250; // 2.5% in basis points
    address public feeRecipient;

    event ItemListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemSold(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price);
    event ItemUnlisted(address indexed nftContract, uint256 indexed tokenId, address indexed seller);
    event PlatformFeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);

    constructor(address _feeRecipient) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
    }

    function listItem(address nftContract, uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be greater than 0");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");

        // Check if it's an AssetNFT or TemplateNFT and ensure it's listed there too
        if (nftContract == address(this)) {
            revert("Cannot list marketplace tokens");
        }

        // For our custom contracts, check if they're listed
        try AssetNFT(nftContract).getAsset(tokenId) returns (AssetNFT.Asset memory asset) {
            require(asset.isListed, "Asset not listed for sale");
            require(asset.price == price, "Price mismatch with asset listing");
        } catch {
            try TemplateNFT(nftContract).getTemplate(tokenId) returns (TemplateNFT.Template memory template) {
                require(template.isListed, "Template not listed for sale");
                require(template.price == price, "Price mismatch with template listing");
            } catch {
                // Allow listing of any ERC721 token, but our contracts have additional checks
            }
        }

        listings[nftContract][tokenId] = Listing({
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true,
            listedAt: block.timestamp
        });

        userListings[msg.sender].push(tokenId);

        emit ItemListed(nftContract, tokenId, msg.sender, price);
    }

    function buyItem(address nftContract, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.active, "Item not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        uint256 price = listing.price;
        address seller = listing.seller;

        // Calculate fees
        uint256 feeAmount = (price * platformFee) / 10000;
        uint256 sellerAmount = price - feeAmount;

        // Handle royalties for our custom contracts
        uint256 royaltyAmount = 0;
        address royaltyRecipient = address(0);

        try AssetNFT(nftContract).calculateRoyalty(tokenId, price) returns (uint256 royalty) {
            royaltyAmount = royalty;
            AssetNFT.Asset memory asset = AssetNFT(nftContract).getAsset(tokenId);
            royaltyRecipient = asset.creator;
            sellerAmount -= royaltyAmount;
        } catch {
            try TemplateNFT(nftContract).calculateRoyalty(tokenId, price) returns (uint256 royalty) {
                royaltyAmount = royalty;
                TemplateNFT.Template memory template = TemplateNFT(nftContract).getTemplate(tokenId);
                royaltyRecipient = template.creator;
                sellerAmount -= royaltyAmount;
            } catch {
                // No royalties for other contracts
            }
        }

        // Transfer NFT
        IERC721(nftContract).transferFrom(seller, msg.sender, tokenId);

        // Distribute payments
        if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
            payable(royaltyRecipient).transfer(royaltyAmount);
        }

        payable(seller).transfer(sellerAmount);
        payable(feeRecipient).transfer(feeAmount);

        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        // Remove listing
        listings[nftContract][tokenId].active = false;

        emit ItemSold(nftContract, tokenId, msg.sender, seller, price);
    }

    function unlistItem(address nftContract, uint256 tokenId) external {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Item not listed");

        listings[nftContract][tokenId].active = false;

        emit ItemUnlisted(nftContract, tokenId, msg.sender);
    }

    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) {
        return listings[nftContract][tokenId];
    }

    function getUserListings(address user) external view returns (uint256[] memory) {
        return userListings[user];
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(feeRecipient).transfer(balance);
    }
}

