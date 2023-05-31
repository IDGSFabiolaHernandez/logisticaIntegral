import { Component, OnInit } from '@angular/core';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-registro-socios',
  	templateUrl: './registro-socio.component.html',
  	styleUrls: ['./registro-socio.component.css']
})
export class RegistroSociosComponent extends Grid implements OnInit {
	public mostrarOpciones : boolean = false;
	public intermediarios : any = [];

	async ngOnInit () : Promise<void> {
		
	}

	mostrarOpcionesCliente () : void {
		/*const campoNombre : any = this.formNuevoSocio.get('clienteReporte')?.value;
		this.mostrarOpciones = campoNombre.length > 0;
		this.formNuevoSocio.get('clienteReporte')?.setValue( campoNombre.trim() );*/
	}
}