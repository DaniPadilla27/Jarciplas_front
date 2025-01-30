import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // <-- Importar HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';
import { AdmRoutingModule } from './adm-routing.module';
import { AdmComponent } from './adm.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ApiService } from '../../services/api.service';  // <-- Importar ApiService (ajusta la ruta si es necesario)

@NgModule({
  declarations: [
    HeaderComponent,
    AdmComponent,
    FooterComponent,
    ProductosComponent,
  ],
  imports: [
    CommonModule,
    AdmRoutingModule,
    ReactiveFormsModule,
    HttpClientModule  // <-- Asegurar que está aquí
  ],
  providers: [ApiService]  // <-- Asegurar que ApiService está en providers
})
export class AdmModule {}
