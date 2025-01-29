import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrabajadorComponent } from './trabajador.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
const routes: Routes = [
{
  path: '',
  redirectTo:'home',
  pathMatch: 'full',
},
{
  path: '',
  component: TrabajadorComponent,
  children: [

    {
      path: 'home',
      component:InicioComponent,
    },
    {
      path: 'productos',
      component:ProductosComponent,
    },
    {
      path:'clientes',
      component:ClientesComponent
    },
  ],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrabajadorRoutingModule { }
