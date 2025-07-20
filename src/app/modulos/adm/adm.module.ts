import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // <-- Importar HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';
import { AdmRoutingModule } from './adm-routing.module';
import { AdmComponent } from './adm.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ApiService } from '../../services/api.service';
import { PoliticasComponent } from './pages/politicas/politicas.component';  // <-- Importar ApiService (ajusta la ruta si es necesario)
import { TrabajadorComponent } from '../trabajador/trabajador.component';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadores.component';
import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { PronosticoComponent } from './pages/pronostico/pronostico.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';


@NgModule({
  declarations: [
    HeaderComponent,
    AdmComponent,
    FooterComponent,
    ProductosComponent,
    PoliticasComponent,
    TrabajadoresComponent,
    ContactanosComponent,
    NotificacionesComponent,
    PronosticoComponent
    
  ],
  imports: [  
    CommonModule,
    AdmRoutingModule,
    ReactiveFormsModule,
    HttpClientModule, // <-- Asegurar que está aquí
  ],
  providers: [ApiService]  // <-- Asegurar que ApiService está en providers
})
export class AdmModule {}
