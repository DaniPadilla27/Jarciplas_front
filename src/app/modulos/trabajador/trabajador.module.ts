import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajadorRoutingModule } from './trabajador-routing.module';
import { ProductosComponent } from './pages/productos/productos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TrabajadorComponent } from './trabajador.component';


@NgModule({
  declarations: [
    TrabajadorComponent,
    ClientesComponent,
    InicioComponent,
    ProductosComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TrabajadorRoutingModule
  ]
})
export class TrabajadorModule { }
