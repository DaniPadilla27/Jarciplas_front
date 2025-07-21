import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { ClienteComponent } from "./cliente.component"
import { CatalogoComponent } from "./pages/catalogo/catalogo.component"
import { InicioComponent } from "./pages/inicio/inicio.component"
import { OfertasComponent } from "./pages/ofertas/ofertas.component"
import { NotificacionesComponent } from "../adm/pages/notificaciones/notificaciones.component"
import { PerfilComponent } from "./pages/perfil/perfil.component"
import { HistorialComponent } from "./pages/historial/historial.component"
import { DetalleProductoComponent } from "./pages/detalle-producto/detalle-producto.component"
import { CarritoComponent } from "./pages/carrito/carrito.component"

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "",
    component: ClienteComponent,
    children: [
      {
        path: "home",
        component: InicioComponent,
      },
      {
        path: "catalogo",
        component: CatalogoComponent,
      },
      {
        path: "ofertas",
        component: OfertasComponent,
      },
      {
        path: "notificaciones",
        component: NotificacionesComponent,
      },
      {
        path: "perfil",
        component: PerfilComponent,
      },
      {
        path: "historial",
        component: HistorialComponent,
      },
      {
        // CAMBIO PRINCIPAL: Solo SSR, sin prerendering
        path: "detalle/:id",
        component: DetalleProductoComponent,
        data: {
          renderMode: "csr", // Cambiar a client-side rendering
        },
      },
      {
        path: "carrito",
        component: CarritoComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteRoutingModule {}
