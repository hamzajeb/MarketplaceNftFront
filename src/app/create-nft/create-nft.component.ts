import { environment } from './../../environments/environment';
import { ethers } from "ethers"
import { ContractService } from './../services/contract.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators,FormBuilder,FormGroup } from '@angular/forms';
const axios = require('axios');
const FormData = require('form-data');
// //this will allow us to upload the metadata aabout the newly created nft
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.io:5001/api/v0')
//ipfs host dans un url(token URI dans smart contract NFT function mint) api format json contient les infos sur NFTs
//infura,Pinata is an NFT distribution platform empowering creators, developers and marketplaces to store, manage and monetize their content across any blockchain.
// const client = ipfsHttpClient('https://ipfs.io:5001/api/v0')

//try resetting your Metamask account by going to Settings > Advanced > Reset Account.
@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.scss']
})
export class CreateNftComponent implements OnInit {
  LoadImageFinish=true
  form:FormGroup
  key = environment.REACT_APP_PINATA_KEY
  secret =environment.REACT_APP_PINATA_SECRET;
  nft:any = {};
  marketplace:any = {};
  image:any;
  constructor(private formBuilder:FormBuilder,private contractService:ContractService) { 
    this.nft=this.contractService.nftContract
    console.log(this.contractService.nftContract)
    this.marketplace=this.contractService.marketplaceContract
    console.log(this.contractService.nftContract)
    console.log(this.key)
    this.form=this.formBuilder.group({
      Name:[''],
      image:[null],
      price:[''],
      description:[''],
      })
  }

  ngOnInit(): void {
    
  }
  
   uploadJSONToIPFS = async (JSONBody: any): Promise<{ success: boolean, pinataURL?: string, message?: string }> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: this.key,
          pinata_secret_api_key: this.secret,
        },
      })
      .then(function (response:any) {
        return {
          success: true,
          pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        };
      })
      .catch(function (error:any) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  };
  async uploadFileToIPFS (file :any)  {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios 
        .post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: this.key,
                pinata_secret_api_key: this.secret,
            }
        })
        .then(function (response:any) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error:any) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};
fileAttr1 = "Path d'image"
async  uploadToIPFS(e:any) {
  this.LoadImageFinish=false
  var file = e.target.files[0];
  //check for file extension
  if (e.target.files && e.target.files[0]) {
    this.fileAttr1 = '';
    Array.from(e.target.files).forEach((file: any) => {
      this.fileAttr1 += file.name;
    });
  }
  try {
      //upload the file to IPFS
      const response = await this.uploadFileToIPFS(file);
      this.LoadImageFinish=true
      if(response.success === true) {
          console.log("Uploaded image to Pinata: ", response.pinataURL)
          this.image=response.pinataURL;
      }
  }
  catch(e) {
      console.log("Error during file upload", e);
  }
}
//This function uploads the metadata to IPFS
async  createNFT() {
  const price=this.form.value.price
  const name=this.form.value.Name
  const description=this.form.value.description
  const image=this.image
  // const {name, description, price} = formParams;
  //Make sure that none of the fields are empty
  if (!image || !price || !name || !description) return

  const nftJSON = {
    image, price, name, description
  }

  try {
      //upload the metadata JSON to IPFS
      const response = await this.uploadJSONToIPFS(nftJSON);
      if(response.success === true){
          console.log("Uploaded JSON to Pinata: ", response)
          // const result = await client.add(JSON.stringify({image, price, name, description}))
          this.mintThenList(response.pinataURL)
          // return response.pinataURL;
      }
  }
  catch(e) {
      console.log("error uploading JSON metadata:", e)
  }
}


 async mintThenList(result:any)  {
 console.log(this.nft)
  // mint nft 
  await(await this.nft.mint(result)).wait()
  // get tokenId of new nft 
  const id = await this.nft.tokenCount()
  // approve marketplace to spend nft
  await(await this.nft.setApprovalForAll(this.marketplace.address, true)).wait()
  // add nft to marketplace
  const listingPrice = ethers.utils.parseEther(this.form.value.price.toString())
  await(await this.marketplace.makeItem(this.nft.address, id, listingPrice)).wait()
   this.form=this.formBuilder.group({
      Name:[''],
      image:[null],
      price:[''],
      description:[''],
      })
  this.fileAttr1= "Path d'image";

}

  
  
  
  
  
}
