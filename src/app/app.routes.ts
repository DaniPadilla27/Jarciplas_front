import { Routes } from '@angular/router';
import path from 'path';

 export const routes: Routes = [
   { path:'',
    redirectTo:'public',
    pathMatch: 'full',
   },
  
  {
      path: 'public',
      loadChildren: () => import('./modulos/public/public.module').then(m => m.PublicModule)
    },
    {
      path: 'adm',
      loadChildren: () => import('./modulos/adm/adm.module').then(m => m.AdmModule)
    },
    {
      path: 'trabajador',
      loadChildren: () => import('./modulos/trabajador/trabajador.module').then(m => m.TrabajadorModule)
    }




  ];