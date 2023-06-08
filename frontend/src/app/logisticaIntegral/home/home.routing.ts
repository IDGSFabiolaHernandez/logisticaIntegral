import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { ListaSociosComponent } from './modules/socios/consultas/consulta-socios/lista-socios.component';
import { SociosEmpresasComponent } from './modules/socios/consultas/consulta-enlaces-socios-empresas/socios-empresas.component';
import { ConsultaMensualidadesComponent } from './modules/socios/consultas/consulta-mensualidades/consulta-mensualidades.component';
import { AdminGuard } from '../guards/admin.guard';
import { PagoMensualidadesComponent } from './modules/socios/consultas/pago-mensualidades/pago-mensualidades.component';


export const HomeRoutes: Routes = [
    {
        path: 'logistica',
        canActivate : [AdminGuard],
        component: HomeComponent,
        children: [
            {
                path: 'inicio',
                component: InicioComponent
            }, {
                path: 'socios',
                component: ListaSociosComponent
            }, {
                path: 'socios/sociosEmpresas',
                component: SociosEmpresasComponent
            }, {
                path: 'mensualidades',
                component: ConsultaMensualidadesComponent
            }, {
                path: 'mensualidades/pagoMensualidades',
                component: PagoMensualidadesComponent
            }
        ]
    }
]