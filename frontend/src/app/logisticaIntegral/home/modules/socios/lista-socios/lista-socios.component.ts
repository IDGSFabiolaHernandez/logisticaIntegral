import { Component } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import Option from 'src/app/shared/interfaces/options.interface';

@Component({
  	selector: 'app-lista-socios',
  	templateUrl: './lista-socios.component.html',
  	styleUrls: ['./lista-socios.component.css']
})
export class ListaSociosComponent {
	protected opcionesSocios : Option[] = [];
	private sociosSeleccionados : any[] = [];

	protected columnasSocio : any = {
		'id' 				  : '#',
		'nombreSocio' 		  : 'Socio',
		'status' 			  : 'Status Socio',
		'numEmpresas' 		  : 'Relación Empresas',
		'curpSocio' 		  : 'CURP',
		'rfcSocio' 			  : 'RFC',
		'nombreIntermediario' : 'Intermediario'
	};

	protected listaSocios : any[] = [];

	constructor (
		private mensajes : MensajesService,
		private apiSocios : SociosService
	) {}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await this.obtenerSociosSelect();
		this.mensajes.cerrarMensajes();
	}

	private obtenerSociosSelect () : Promise<any> {
		return this.apiSocios.obtenerSociosSelect().toPromise().then(
			respuesta => {
				this.opcionesSocios = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	onSelectionChange(selectedOptions: Option[]) {
		this.sociosSeleccionados = selectedOptions;
	}

	consultarSociosPorSelect () : void {
		this.mensajes.mensajeEsperar();

		if ( this.sociosSeleccionados.length == 0 ) {
			this.mensajes.mensajeGenerico('Para continuar antes debe seleccionar al menos un Socio', 'info');
			return;
		}

		const arregloSocios = { socios : this.sociosSeleccionados.map(({value}) => value) };

		this.apiSocios.obtenerListaSocios(arregloSocios).subscribe(
			respuesta => {
				this.listaSocios = respuesta.data;
				console.log(this.listaSocios);
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}
}