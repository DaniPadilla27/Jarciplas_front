import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importación correcta
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', // Redirige directamente a home en lugar de estar vacío
    pathMatch: 'full',
  },
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: 'home',
        component: InicioComponent, // Correcta definición de la ruta
      },
      {
        path: 'login',
        component: LoginComponent, // Ruta login
      },
      {
        path: 'registro',
        component: RegistroComponent, // Ruta registro
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule], // Asegúrate de importar ReactiveFormsModule
  exports: [RouterModule],
})
export class PublicRoutingModule {}
