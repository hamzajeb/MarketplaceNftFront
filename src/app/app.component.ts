import { ContractService } from './services/contract.service';

import { ethers } from "ethers"
import MarketplaceAbi from '../app/contractsData/Marketplace.json'
import MarketplaceAddress from '../app/contractsData/Marketplace-address.json'
import NFTAbi from '../app/contractsData/NFT.json'
import NFTAddress from '../app/contractsData/NFT-address.json'
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nft-marketplace-front2';

  constructor(){
  }

  ngOnInit() {

  }


}


