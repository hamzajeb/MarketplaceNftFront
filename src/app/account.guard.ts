import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { ContractService } from './services/contract.service';
@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {


  constructor(private route:Router,private contractService:ContractService){
    
  }
  async canActivate(){

    if(this.contractService.connected){
      return true;
    }else{
      this.route.navigateByUrl('');
      return false;
    }
  }
  
}
