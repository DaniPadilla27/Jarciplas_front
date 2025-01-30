import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { ClienteComponent } from './cliente.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [


  {
    path: '',
    redirectTo:'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ClienteComponent,
    children: [

      {
        path: 'home',
        component:InicioComponent,
      },
      {
        path: 'catalogo',
        component:CatalogoComponent,
      },




    ],
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
