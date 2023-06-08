import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './modules/inicio/inicio.component';
import { ListaSociosComponent } from './modules/socios/consultas/consulta-socios/lista-socios.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { SociosEmpresasComponent } from './modules/socios/consultas/consulta-enlaces-socios-empresas/socios-empresas.component';
import { ConsultaMensualidadesComponent } from './modules/socios/consultas/consulta-mensualidades/consulta-mensualidades.component';
import { PagoMensualidadesComponent } from './modules/socios/consultas/pago-mensualidades/pago-mensualidades.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        InicioComponent,
        ListaSociosComponent,
        DatatableComponent,
        SociosEmpresasComponent,
        ConsultaMensualidadesComponent,
        PagoMensualidadesComponent,
    ]
})

export class HomeModule {}