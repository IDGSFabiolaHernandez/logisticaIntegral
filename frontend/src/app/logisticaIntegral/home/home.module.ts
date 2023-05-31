import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './modules/inicio/inicio.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { RegistroSociosComponent } from './modules/socios/registro-socios/registro-socio.component';
import { ListaSociosComponent } from './modules/socios/lista-socios/lista-socios.component';
import { DatatableComponent } from './components/datatable/datatable.component';

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        InicioComponent,
        DropdownComponent,
        RegistroSociosComponent,
        ListaSociosComponent,
        DatatableComponent,
    ]
})

export class HomeModule {}