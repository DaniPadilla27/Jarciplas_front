
import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';
import { ClienteRoutingModule } from './cliente-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { ClienteComponent } from './cliente.component';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    InicioComponent,
    CatalogoComponent,
    ClienteComponent,
    OfertasComponent,
    PerfilComponent,
    HistorialComponent,
    DetalleProductoComponent,
    CarritoComponent,
    
    
  ],
  imports: [
    CommonModule,
    HttpClientModule, 
    ClienteRoutingModule,
    ReactiveFormsModule,FormsModule,
  ]
  ,schemas:[CUSTOM_ELEMENTS_SCHEMA]
    ,providers:[provideClientHydration(),ApiService]
})
export class ClienteModule { }
