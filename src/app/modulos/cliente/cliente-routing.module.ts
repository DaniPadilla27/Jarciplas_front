import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { ClienteComponent } from './cliente.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';

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
      {
        path: 'ofertas',
        component:OfertasComponent,
      },
      {
        path: 'notificaciones',
        component:NotificacionesComponent,
      },
      {
        path: 'perfil',
        component:PerfilComponent,
      },
      {
        path: 'historial',
        component:HistorialComponent,
      },
      // {
      //   path: 'producto/:id',
      //   component:DetalleProductoComponent,
      // },
      {
        path: 'detalle/:id',
        component:DetalleProductoComponent,
      },





    ],
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
