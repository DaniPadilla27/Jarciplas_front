import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos.component';
import { TrabajadorComponent } from '../trabajador/trabajador.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AdmComponent } from './adm.component';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadores.component';
import { PoliticasComponent } from './pages/politicas/politicas.component';
import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { PronosticoComponent } from './pages/pronostico/pronostico.component';
import { DatallesComponent } from './pages/datalles/datalles.component';
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
      {
        path: 'politicas',
        component: PoliticasComponent,
      },
      {
        path: 'contactanos',
        component: ContactanosComponent,
      },
      {
        path: 'pronostico',
        component: PronosticoComponent,
      },
      {
        path: 'detalles',
        component: DatallesComponent,
      },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmRoutingModule { }
