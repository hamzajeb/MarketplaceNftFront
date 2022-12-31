import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-my-listed-items',
  templateUrl: './my-listed-items.component.html',
  styleUrls: ['./my-listed-items.component.scss']
})
export class MyListedItemsComponent implements OnInit {
  loading:any = true
  nft:any = {}
  marketplace:any = {}
  ListedItems:any=[]
  SoldItems:any=[]
  account:any = null
  constructor(private contractService:ContractService) { 
    this.marketplace=this.contractService.marketplaceContract
    this.nft=this.contractService.nftContract
    this.account=this.contractService.account
    this.loadListedItems()
  }

  ngOnInit(): void {
  }

  async loadListedItems  ()  {
    // Load all sold items that the user listed
    const itemCount = await this.marketplace.itemCount()
    let listedItems = []//tous votre nft minting
    let soldItems = []//votre NFTs qui sont vendu
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await this.marketplace.items(indx)
      if (i.seller.toLowerCase() === this.account) {
        // get uri url from nft contract
        const uri = await this.nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await this.marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    this.loading=false
    this.ListedItems=listedItems
    this.SoldItems=soldItems
  }
}
