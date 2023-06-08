import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from 'src/app/logisticaIntegral/home/components/dropdown/dropdown.component';
import { RegistroSociosComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-socio/registro-socio.component';
import { RegistroEnlaceSociosEmpresasComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-enlace-socios-empresas/registro-enlace-socios-empresas.component';
import { RegistroPrestamoSocioComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-prestamo-socio/registro-prestamo-socio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DropdownComponent,
    RegistroSociosComponent,
    RegistroEnlaceSociosEmpresasComponent,
    RegistroPrestamoSocioComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    DropdownComponent,
    RegistroSociosComponent,
    RegistroEnlaceSociosEmpresasComponent,
    RegistroPrestamoSocioComponent
  ]
})
export class SharedModule { }
