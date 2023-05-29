import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { SociosComponent } from './modules/socios/socios.component';


export const HomeRoutes: Routes = [
    {
        path: 'logistica',
        component: HomeComponent,
        children: [
            {
                path: 'inicio',
                component: InicioComponent
            },
            {
                path: 'socios',
                component: SociosComponent
            }
        ]
    }
]