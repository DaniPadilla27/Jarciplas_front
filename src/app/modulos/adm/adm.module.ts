import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmRoutingModule } from './adm-routing.module';
import { AdmComponent } from './adm.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductosComponent } from './pages/productos/productos.component';
@NgModule({
  declarations: [

    HeaderComponent,
    AdmComponent,
    FooterComponent,
    ProductosComponent
    
  ],
  imports: [
    CommonModule,
    AdmRoutingModule,
    
   
  ]
})
export class AdmModule { }
