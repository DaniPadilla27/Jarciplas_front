import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { TrabajadorComponent } from '../trabajador/trabajador.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AdmComponent } from './adm.component';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadores.component';
const routes: Routes = [
    

  {
    path: '',
    redirectTo:'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdmComponent,
    children: [
      {
        path: 'home',
        component: InicioComponent,
      },
      {
        path: 'productos',
        component: ProductosComponent,
      },
      {
        path: 'trabajadores',
        component: TrabajadoresComponent,
      },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmRoutingModule { }
