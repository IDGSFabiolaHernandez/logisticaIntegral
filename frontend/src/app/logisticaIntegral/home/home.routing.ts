import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { ListaSociosComponent } from './modules/socios/consulta-socios/lista-socios.component';
import { SociosEmpresasComponent } from './modules/socios/consulta-enlaces-socios-empresas/socios-empresas.component';
import { ConsultaMensualidadesComponent } from './modules/socios/consulta-mensualidades/consulta-mensualidades.component';


export const HomeRoutes: Routes = [
    {
        path: 'logistica',
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
            }
        ]
    }
]