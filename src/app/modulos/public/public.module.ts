import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicRoutingModule } from './public-routing.module';
import { InicioComponent } from './components/inicio/inicio.component';
import { PublicComponent } from './public.component';
import { RouterModule } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ApiService } from '../../services/api.service';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';



@NgModule({
  declarations: [
    PublicComponent ,// Importa el componente standalone
   LoginComponent ,InicioComponent, HeaderComponent, FooterComponent,RegistroComponent
   
   // Declara solo componentes no standalone
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,FormsModule,
  ]
  ,schemas:[CUSTOM_ELEMENTS_SCHEMA]
  ,providers:[provideClientHydration(),ApiService]
})
export class PublicModule { }
