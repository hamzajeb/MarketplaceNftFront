import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.scss']
})
export class MyPurchasesComponent implements OnInit {
  loading:any=true;
  nft:any = {};
  marketplace:any = {};
  purchases:any=[];
  account:any = null
  constructor(private contractService:ContractService) { 
    this.marketplace=this.contractService.marketplaceContract
    this.nft=this.contractService.nftContract
    this.account=this.contractService.account
    this.loadPurchasedItems()
  }

  ngOnInit(): void {
  }

  async loadPurchasedItems ()  {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  this.marketplace.filters.Bought(null,null,null,null,null,this.account)
    const results = await this.marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async (i:any) => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await this.nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await this.marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    console.log('purchases.length')
    console.log(purchases.length)
    this.loading=false
    this.purchases=purchases

  }

}
