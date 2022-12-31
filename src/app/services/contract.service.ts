import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  nftContract:any = {};
  marketplaceContract:any = {};
  connected=false;
  account:any = null
  signer:any
  private messageSubject = new Subject<boolean>();
  message$ = this.messageSubject.asObservable();

  updateConnect(message: boolean) {
    this.messageSubject.next(message);
  }
  constructor() { }
}
