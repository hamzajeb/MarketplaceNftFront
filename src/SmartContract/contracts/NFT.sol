// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
//version solidity use (hardhat.config)

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//L'ERC-721 introduit une norme pour les NFT. En d'autres termes, ce type de jeton est unique 
//et peut avoir une valeur différente de celle d'un autre jeton du même contrat intelligent,

//(ERC) 721 is a data standard for creating NFT

//ERC-721 is a token standard on Ethereum for non-fungible tokens (NFTs). Fungible means interchangeable and replaceable;
// Bitcoin is fungible because any Bitcoin can replace any other Bitcoin.
// Each NFT, on the other hand, is completely unique. One NFT cannot replace another.

//ERC-721 is an standard that defines the set of all functions that a nft contract should have 

//heriter les fonctions d'ERC721
contract NFT is ERC721URIStorage {
        //uinit : a value data type that must be non-negative; that is, its value is greater than or equal to zero
        //default value is 0 (solidity does it automatically)
        uint public tokenCount;
        //that 's called only once after the contact has been deployed to blockchain
        //constructor of ERC721URIStorage (NAME OF NFT,SYMBOL OF NFT)
        constructor() ERC721("DApp NFT", "DAPP1"){}
        //function for mint new NFT: Minting an NFT, or non-fungible token, is publishing a unique digital asset on a blockchain so that it can be acheter, vendre, and echanger.
        function mint(string memory _tokenURI) external returns(uint) {
            //_tokenURI : metadata of nft : the link to where the content of the nft can be found on ipfs
            //external : function can be called by outside,but not from any functions within this contract
            //HTTP downloads files from one server at a time — but peer-to-peer IPFS retrieves pieces from multiple nodes at once,
            tokenCount ++;
            //msg.sender will be the person who's currently connecting with the contract.
            //msg.sender:pass in the address that we're minting for which is the caller of this contract
            //Safely mints tokenCount and transfers it to msg.sender.
            _safeMint(msg.sender, tokenCount);
            //newly minted NFT(id of NFT : tokenCount)
            //Sets _tokenURI as the tokenURI of tokenCount
            _setTokenURI(tokenCount, _tokenURI);
            return(tokenCount);
        }
}