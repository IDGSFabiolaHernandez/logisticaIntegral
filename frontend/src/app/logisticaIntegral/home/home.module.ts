import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './modules/inicio/inicio.component';
import { ListaSociosComponent } from './modules/socios/consulta-socios/lista-socios.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { SociosEmpresasComponent } from './modules/socios/consulta-enlaces-socios-empresas/socios-empresas.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ConsultaMensualidadesComponent } from './modules/socios/consulta-mensualidades/consulta-mensualidades.component';
import { PagoMensualidadesComponent } from './modules/socios/pago-mensualidades/pago-mensualidades.component';

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        InicioComponent,
        ListaSociosComponent,
        DatatableComponent,
        SociosEmpresasComponent,
        DropdownComponent,
        ConsultaMensualidadesComponent,
        PagoMensualidadesComponent,
    ]
})

export class HomeModule {}