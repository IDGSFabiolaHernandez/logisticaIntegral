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
	protected sociosSeleccionados : any[] = [];

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

	async refreshSocios () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await this.obtenerSociosSelect();
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de Socios', 'success');
	}

	onSelectionChange(selectedOptions: Option[]) {
		this.sociosSeleccionados = selectedOptions;
	}

	consultarSociosPorSelect () : void {
		this.mensajes.mensajeEsperar();
		const arregloSocios = { socios : this.sociosSeleccionados.map(({value}) => value) };

		this.apiSocios.obtenerListaSocios(arregloSocios).subscribe(
			respuesta => {
				this.listaSocios = respuesta.data;
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	limpiarGrid () : void {
		this.listaSocios = [];
	}

	canSearch () : boolean {
		return this.sociosSeleccionados.length != 0;
	}

	canCrear () : boolean {
		return this.listaSocios.length != 0;
	}
}