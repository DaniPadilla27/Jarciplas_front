// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: 'public',
    loadChildren: () => import('./modulos/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'adm',
    loadChildren: () => import('./modulos/adm/adm.module').then(m => m.AdmModule),
    canActivate: [AuthGuard]  // Protección para todas las rutas bajo /adm
  },
  {
    path: 'trabajador',
    loadChildren: () => import('./modulos/trabajador/trabajador.module').then(m => m.TrabajadorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cliente',
    loadChildren: () => import('./modulos/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [AuthGuard]
  }
];