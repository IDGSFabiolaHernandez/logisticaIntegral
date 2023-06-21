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
import { ConsultaPrestamosSociosComponent } from './modules/socios/consultas/consulta-prestamos-socios/consulta-prestamos-socios.component';
import { ModificacionSocioComponent } from './modules/socios/modificaciones/modificacion-socio/modificacion-socio.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DetalleEnlaceSocioEmpresasComponent } from './modules/socios/detalles/detalle-enlace-socio-empresas/detalle-enlace-socio-empresas.component';
import { ModificacionEnlaceSocioEmpresaComponent } from './modules/socios/modificaciones/modificacion-enlace-socio-empresa/modificacion-enlace-socio-empresa.component';
import { ModificacionPerfilComponent } from './modules/usuarios/modificaciones/modificacion-perfil/modificacion-perfil.component';

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ModalModule.forChild()
    ],
    declarations: [
        InicioComponent,
        ListaSociosComponent,
        DatatableComponent,
        SociosEmpresasComponent,
        ConsultaMensualidadesComponent,
        PagoMensualidadesComponent,
        ConsultaPrestamosSociosComponent,
        ModificacionSocioComponent,
        DetalleEnlaceSocioEmpresasComponent,
        ModificacionEnlaceSocioEmpresaComponent,
        ModificacionPerfilComponent,
    ]
})

export class HomeModule {}