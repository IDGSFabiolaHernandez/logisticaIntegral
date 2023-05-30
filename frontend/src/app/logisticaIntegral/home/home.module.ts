import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './modules/inicio/inicio.component';
import { SociosComponent } from './modules/socios/socios.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(HomeRoutes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        InicioComponent,
        SociosComponent,
        DropdownComponent,
    ]
})

export class HomeModule {}