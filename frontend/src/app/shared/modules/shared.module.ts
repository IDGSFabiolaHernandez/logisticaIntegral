import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from 'src/app/logisticaIntegral/home/components/dropdown/dropdown.component';
import { RegistroSociosComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-socio/registro-socio.component';
import { RegistroEnlaceSociosEmpresasComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-enlace-socio-empresa/registro-enlace-socio-empresa.component';
import { RegistroPrestamoSocioComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-prestamo-socio/registro-prestamo-socio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroIntermediarioSociosComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-intermediario-socios/registro-intermediario-socios.component';

@NgModule({
  declarations: [
    DropdownComponent,
    RegistroSociosComponent,
    RegistroEnlaceSociosEmpresasComponent,
    RegistroPrestamoSocioComponent,
    RegistroIntermediarioSociosComponent
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
    RegistroPrestamoSocioComponent,
    RegistroIntermediarioSociosComponent
  ]
})
export class SharedModule { }
