import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { ListaSociosComponent } from './modules/socios/lista-socios/lista-socios.component';


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
                component: ListaSociosComponent
            }
        ]
    }
]