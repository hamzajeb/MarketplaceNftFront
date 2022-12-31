//waffle : The most advanced framework for testing smart contracts
//Chai n'est pas la seule librairie disponible pour gérer les assertions, mais elle offre de nombreuses possibilités d'écriture.(par defaut dans postman)
const { expect } = require("chai"); 
const {ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())//2eth ==2000000000000000000
const fromWei = (num) => ethers.utils.formatEther(num)
//name of test is NFTMarketplace
describe("NFTMarketplace", function () {
    let NFT;
    let nft;
    let Marketplace;
    let marketplace
    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let feePercent = 1;//0.01
    let URI = "simple URI"
    //this function  prevent us from having to copy and paste all this code at the beginning of each of the tests,
    beforeEach(async function () {
        // Get the ContractFactories and Signers(Ethereum account).
        NFT = await ethers.getContractFactory("NFT");
        Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    
        // deployer les contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
      });

    //first test : deployement
    describe("Deployment", function () {
        //test of deployement contract 1 (minting NFT)
        it("Doit suivre le nom et le symbole du contract nft", async function () {
          const nftName = "DApp NFT"
          const nftSymbol = "DAPP1"
          expect(await nft.name()).to.equal(nftName);
          expect(await nft.symbol()).to.equal(nftSymbol);
        });
        //test of deployement contract 2 (marketplace NFT)
        it("Doit suivre feeAccount and feePercent du marketplace", async function () {
          expect(await marketplace.feeAccount()).to.equal(deployer.address);
          expect(await marketplace.feePercent()).to.equal(feePercent);
        });
    });

    //seconde test : Minting NFTs
    describe("Minting NFTs", function () {

        it("Devrait suivre chaque minted NFT", async function () {
          // addr1 mints an nft
          await nft.connect(addr1).mint(URI)
          expect(await nft.tokenCount()).to.equal(1);
          expect(await nft.balanceOf(addr1.address)).to.equal(1);
          expect(await nft.tokenURI(1)).to.equal(URI);
          // addr2 mints an nft
          await nft.connect(addr2).mint(URI)
          expect(await nft.tokenCount()).to.equal(2);
          expect(await nft.balanceOf(addr2.address)).to.equal(1);
          expect(await nft.tokenURI(2)).to.equal(URI);
        });
    })
    //test 3 :vendre NFT
    describe("Making marketplace items", function () {
        let price = 2
        let result 
        //beforeEach() is run before each test in a describe
        beforeEach(async function () {
          // addr1 mints an nft
          await nft.connect(addr1).mint(URI)
          //When you sell NFTs on a Marketplace, you need to authorize this marketplace to transfer sold items from your address to the buyer's address.
          //This is what SetApprovalForAll is used for: because you trust the marketplace, you "approve" it to sell your NFTs (not all your NFTs, but the NFTs you own in the context of this contract).
          //The marketplace is what is called the "operator" in the context of this API.
          await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        })

        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
            // addr1 offers their nft at a price of 2 ether
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1 , toWei(price)))
              .to.emit(marketplace, "Offered")//check inside the transaction log
              .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address
              )
            // Owner of NFT should now be the marketplace : Returns the addres owner of the tokenId token==1
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            // Item count should now equal 1
            expect(await marketplace.itemCount()).to.equal(1)
            // Get item from items mapping then check fields to ensure they are correct
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(price))
            expect(item.sold).to.equal(false)
          });
          //annuler la transaction si le prix == 0
          it("Should fail if price is set to zero", async function () {
            await expect(
              marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than zero");
          });
      
        });

        //test 4 : acheter nft
        describe("Purchasing marketplace items", function () {
            let price = 2
            let fee = (feePercent/100)*price
            let totalPriceInWei
            beforeEach(async function () {
              // addr1 mints an nft
              await nft.connect(addr1).mint(URI)
              // addr1 approves marketplace to spend tokens
              await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
              // addr1 makes their nft a marketplace item.
              await marketplace.connect(addr1).makeItem(nft.address, 1 , toWei(price))
            })
            it("Should update item as sold(true), pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
              const sellerInitalEthBal = await addr1.getBalance()
              const feeAccountInitialEthBal = await deployer.getBalance()
              // fetch items total price (market fees + item price)
              totalPriceInWei = await marketplace.getTotalPrice(1);//1 is itemId
              // addr 2 purchases(achete) item.
              // value: totalPriceInWei ==> we can specify the amount of ether we want to send with a call ==> msg.value
              await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
              .to.emit(marketplace, "Bought")
                .withArgs(//ensure that a bought event was emmitted with the following arguments ,we ensure that item id is 1 ...
                  1,
                  nft.address,
                  1,
                  toWei(price),
                  addr1.address,
                  addr2.address
                )
              const sellerFinalEthBal = await addr1.getBalance()
              const feeAccountFinalEthBal = await deployer.getBalance()
              // Item should be marked as sold
              expect((await marketplace.items(1)).sold).to.equal(true)
              // Seller should receive payment for the price of the NFT sold.
              expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitalEthBal))
              // feeAccount should receive fee
              expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal))
              // The buyer (addr2) should now own the nft
              expect(await nft.ownerOf(1)).to.equal(addr2.address);
            })
            //ensure if the 3 require in Marketplace.sol (purchaseItem) worked
            it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
              // fails for invalid item ids
              await expect(
                marketplace.connect(addr2).purchaseItem(2, {value: totalPriceInWei})
              ).to.be.revertedWith("item doesn't exist");//text of error should br the same in require
              await expect(
                marketplace.connect(addr2).purchaseItem(0, {value: totalPriceInWei})
              ).to.be.revertedWith("item doesn't exist");
              // Fails when not enough ether is paid with the transaction. 
              // In this instance, fails when buyer only sends enough ether to cover the price of the nft
              // not the additional market fee.
              await expect(
                marketplace.connect(addr2).purchaseItem(1, {value: toWei(price)})
              ).to.be.revertedWith("not enough ether to cover item price and market fee"); 
              // addr2 purchases item 1
              await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei})
              // addr3 tries purchasing item 1 after its been sold 
              const addr3 = addrs[0]
              await expect(
                marketplace.connect(addr3).purchaseItem(1, {value: totalPriceInWei})
              ).to.be.revertedWith("item already sold");
            });
          })
})