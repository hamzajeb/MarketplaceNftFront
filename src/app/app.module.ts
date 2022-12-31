import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table'  
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule} from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterModule ,Routes, CanActivate} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import { HomeComponent } from './home/home.component';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { CreateNftComponent } from './create-nft/create-nft.component';
import { MyListedItemsComponent } from './Items/my-listed-items/my-listed-items.component';
import { MyPurchasesComponent } from './Items/my-purchases/my-purchases.component';
@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    NavbarComponent,
    CreateNftComponent,
    MyListedItemsComponent,
    MyPurchasesComponent
  ],
  imports: [
    MatSnackBarModule,
    MatCardModule,
    FormsModule,
    MatGridListModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
