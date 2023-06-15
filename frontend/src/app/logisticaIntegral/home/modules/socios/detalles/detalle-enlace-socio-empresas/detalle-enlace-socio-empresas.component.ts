import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';

@Component({
  	selector: 'app-detalle-enlace-socio-empresas',
  	templateUrl: './detalle-enlace-socio-empresas.component.html',
  	styleUrls: ['./detalle-enlace-socio-empresas.component.css']
})
export class DetalleEnlaceSocioEmpresasComponent implements OnInit {
	@Input() idDetalle: number = 0;
	
	protected columnasSocioEmpresas : any = {
		'id' 				: '#',
		'nombreSocio' 		: 'Socio',
		'activoSocio' 		: 'Estatus Socio',
		'nombreEmpresa' 	: 'Empresa',
		'status' 			: 'Estatus Empresa',
		'mesIngreso' 		: 'Ingreso',
		'tipoInstrumento' 	: 'Tipo Instrumento',
		'numeroInstrumento' : 'Número instrumento',
		'mesSalida' 		: 'Salida',
		'observaciones' 	: 'Observaciones'
	};

	protected listaSocioEmpresas : any[] = [];

	constructor (
		private bsModalRef : BsModalRef,
		private apiSocios : SociosService,
		private mensajes : MensajesService
	) {

	}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await Promise.all([
			this.obtenerSocioEmpresas()
		]);
	}

	private obtenerSocioEmpresas () : Promise<any> {
		const datosConsulta = { socios: [this.idDetalle] };

		return this.apiSocios.obtenerSociosEmpresas(datosConsulta).toPromise().then(
			respuesta => {
				this.listaSocioEmpresas = respuesta.data;
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	cancelarModificacion() {
        this.bsModalRef.hide();
    }
}