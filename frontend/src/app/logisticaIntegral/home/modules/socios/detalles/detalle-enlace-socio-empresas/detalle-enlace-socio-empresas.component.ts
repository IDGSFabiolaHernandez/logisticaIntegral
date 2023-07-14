import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { ExcelService } from 'src/app/shared/util/excel.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-detalle-enlace-socio-empresas',
  	templateUrl: './detalle-enlace-socio-empresas.component.html',
  	styleUrls: ['./detalle-enlace-socio-empresas.component.css']
})
export class DetalleEnlaceSocioEmpresasComponent extends Grid implements OnInit, OnDestroy{
	@Input() idDetalle: number = 0;
	@Input() datosPrestamo: boolean = false;
	
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

	protected tableConfig : any = {
		"nombreSocio" : {
			"updateColumn" : true,
			"value" : "id",
			"idModal" : "modificacionEnlaceSocioEmpresa"
		}
	};

	protected listaSocioEmpresas : any[] = [];

	constructor (
		private bsModalRef : BsModalRef,
		private apiSocios : SociosService,
		private mensajes : MensajesService,
		private excelService : ExcelService
	) {
		super();
	}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await Promise.all([
			this.obtenerSocioEmpresas()
		]);
		document.body.classList.remove('modal-open');
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
	}

	private obtenerSocioEmpresas () : Promise<any> {
		const datosConsulta = {
			socios: [this.idDetalle],
			datosPrestamo : this.datosPrestamo
		};

		return this.apiSocios.obtenerSociosEmpresas(datosConsulta).toPromise().then(
			respuesta => {
				this.listaSocioEmpresas = respuesta.data;
				if ( this.listaSocioEmpresas.length == 0 ) {
					this.mensajes.mensajeGenericoToast('No hay información para mostrar', 'warning');
					this.cancelarModificacion();
					return;
				}
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected exportarExcel () : void {
		this.mensajes.mensajeEsperar();

		const nombreExcel = 'Detalle enlace Socio - Empresa: ' + this.getNowString();

		this.excelService.exportarExcel(
			this.listaSocioEmpresas,
			this.columnasSocioEmpresas,
			nombreExcel
		);
	}

	protected canExport () : boolean {
		return this.listaSocioEmpresas.length != 0;
	}

	cancelarModificacion() {
        this.bsModalRef.hide();
		document.body.classList.remove('modal-open');
		document.body.style.paddingRight = '';
		document.body.style.overflow = '';
		this.idDetalle = 0;
		this.listaSocioEmpresas = [];
    }

	ngOnDestroy(): void {
		this.idDetalle = 0;
		this.listaSocioEmpresas = [];
	}
}