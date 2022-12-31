// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

//ReentrancyGuard : that will protect themarketPlace from reentrancyAttack
contract Marketplace is ReentrancyGuard {

    
    //We can use an address to acquire a balance using the .balance method and to transfer a balance using the .transfer method.
    
    //Solidity actually offers two address value types: address and address payable.
    //The difference between the two is that address payable   can receive Ether, .

    //Immutable variables are like constants. Values of immutable variables can 
    //be set inside the constructor but cannot be modified afterwards.

    address payable public immutable feeAccount; // le compte qui perçoit des frais : MarketPlace fee
    uint public immutable feePercent; // le pourcentage de commission sur les ventes 
    uint public itemCount; 


    constructor(uint _feePercent) {
        //we want to set feeAccount to the deployer of this contract
        //msg.sender  :  will be the person who's currently connecting with the contract.
        //The keyword payable :  allows someone to send ether to a contract and run code to account for this deposit.
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    //struct is object in JS
    //each marketplace item has some data associated with it like price ,seller ,address of nft contract,id of nft
    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;//id of the nft being put for sale
        uint price;
        address payable seller;
        bool sold;//nft has been sold or not yet
    }

    //store all of the different items
     mapping(uint => Item) public items;
    //Les événements informent les applications de la modification apportée aux contrats 
    //we can add an index to them it helps to access them later(We can add atmost 3 indexes in one event.)
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    // Make item to offer on the marketplace
    //IERC721 _nft : pass address of nft contract 
    //vendre nft
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        //if this statement fails, the transaction is reverted
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        //msg.sender: the account that called this function,address(this):this contract
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),//the account that called this function
            false
        );
        // emit Offered event
        //https://www.geeksforgeeks.org/what-are-events-in-solidity/
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }


    //acheter nft
    //any function in Solidity with the modifier Payable ensures that the function can send and receive Ether
    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        //Storage is like database data stored in a blockchain node file system (Expensive gas operation)
        //Les variables « storage » sont stockées définitivement dans la blockchain
        //https://www.une-blockchain.fr/solidity-choisir-le-stockage-ou-la-memoire-storage-vs-memory/
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        //msg.value contains the amount of wei (ether / 1e18) sent in the transaction.
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee ");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        // msg.sender : address of buyer who call this function,address(this):this contract
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    //this function get the price of an item (the total price of an item) so that 's the price of the item set by the seller + the market fees
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
    
}