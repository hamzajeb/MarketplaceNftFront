import { Component, OnInit,NgZone} from '@angular/core';
import { ethers } from "ethers"
import { environment } from './../../../environments/environment';
import MarketplaceAbi from '../../../app/contractsData/Marketplace.json'
import MarketplaceAddress from '../../../app/contractsData/Marketplace-address.json'
import NFTAbi from '../../../app/contractsData/NFT.json'
import NFTAddress from '../../../app/contractsData/NFT-address.json'
import { ContractService } from 'src/app/services/contract.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  accountAdmin = environment.ACCOUNT_ADMIN
  loading:any = true
  account:any = null
  nft:any = {}
  marketplace:any = {}
  provider:any;

  constructor(private route:Router,private ngZone: NgZone,private contractService:ContractService) {

   }



  ngOnInit(): void {
    (window as any).ethereum.on('accountsChanged', async (accounts:any) => {
      this.ngZone.run(() => {
        this.contractService.connected=false
        this.contractService.signer=null
        this.account = accounts[0];
        console.log(this.account);
        this.route.navigateByUrl('');       
      });
    });
  }
  async  web3Handler ()  {
    //window.ethereum : Connecting Metamask to frontend
    //fetch the accounts listed in our metamask wallet
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    //first account is the account connected
    // this.dataService.setAccount(accounts[0])
    this.account =accounts[0];
    // console.log(accounts.length)
    console.log(this.account)
    console.log(this.accountAdmin)
    if(this.accountAdmin==this.account){
      console.log("admin")
    }
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    
    // Signers will sign transactions for you using your private key of you account connected
    const signer = (provider as any).getSigner()
    this.loadContracts(signer)
  }

  async loadContracts (signer:any)  {
    // Get deployed copies of contracts
    this.contractService.signer=signer;
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    this.marketplace=marketplace
    console.log("load")
    console.log(this.marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    this.nft=nft
    this.loading=false
    this.contractService.marketplaceContract=marketplace
    this.contractService.nftContract=nft
    this.contractService.connected=true
    this.contractService.account=this.account
    this.contractService.updateConnect(true)
  }

}
