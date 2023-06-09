import { Component } from '@angular/core';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Option from 'src/app/shared/interfaces/options.interface';
import { EmpresasService } from '../../../../../services/empresas/empresas.service';
import Grid from 'src/app/shared/util/funciones-genericas';
import { ExcelService } from 'src/app/shared/util/excel.service';
import { DataService } from 'src/app/logisticaIntegral/services/data.service';

@Component({
  selector: 'app-socios-empresas',
  templateUrl: './socios-empresas.component.html',
  styleUrls: ['./socios-empresas.component.css']
})
export class SociosEmpresasComponent extends Grid{
  	protected opcionesSocios : Option[] = [];
	protected sociosSeleccionados : any[] = [];

	protected opcionesEmpresas : Option[] = [];
	protected empresasSeleccionadas : any[] = [];

	protected columnasSociosEmpresas : any = {
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
		},
		"activoSocio": {
			"selectColumn": true,
        	"selectOptions": ['Activo', 'Inactivo']
		},
		"status": {
			"selectColumn": true,
        	"selectOptions": [
				'Activa',
				'X suspender',
				'En proceso',
				'Suspendida',
				'Maquila cliente',
				'Cuenta bancaria',
			]
		},
		"tipoInstrumento": {
			"selectColumn": true,
			"selectOptions": [
				'Acta Constitutiva',
				'Acta Asamblea Extraordinaria',
				'Poder'
			]
		}
	};

	protected listaSociosEmpresasGeneral : any[] = [];
	protected listaSociosEmpresasSocios : any[] = [];
	protected listaSociosEmpresasEmpresas : any[] = [];

	protected searchOptions = ['general', 'socios', 'empresas'];
	protected optionProgress : string = 'general';

	constructor (
		private mensajes : MensajesService,
		private apiSocios : SociosService,
		private apiEmpresas : EmpresasService,
		private excelService : ExcelService,
		private dataService : DataService
	) {
		super();
		this.dataService.realizarClickConsultarSociosEmpresas.subscribe(() => {
			this.actualizarListaSociosEmpresas();
		});
	}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await Promise.all([
			this.obtenerSociosSelect(),
			this.obtenerEmpresasSelect()
		]);
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

	private obtenerEmpresasSelect () : Promise<any> {
		return this.apiEmpresas.obtenerEmpresasSelect().toPromise().then(
			respuesta => {
				this.opcionesEmpresas = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	async refresh ( op : string ) : Promise<void> {
		this.mensajes.mensajeEsperar();
		if ( op == 'Socios' ){
			await this.obtenerSociosSelect();
		} else if ( op == 'Empresas' ) {
			await this.obtenerEmpresasSelect();
		}
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de '+op, 'success');
	}

	protected onSelectionChange (data: any) : void {
		if ( data.from == 'socios' ) {
			this.sociosSeleccionados = data.selectedOptions;
		} else if ( data.from == 'empresas' ) {
			this.empresasSeleccionadas = data.selectedOptions;
		}
	}

	protected cambioGrid ( op : number ) : void {
		this.optionProgress = this.searchOptions[op];
	}

	protected validarSelect ( op : string ) : boolean {
		return this.optionProgress == 'general' || this.optionProgress == op;
	}

	protected async consultarOptionProgress(): Promise<void> {
		this.mensajes.mensajeEsperar();
		let datosConsulta: any = {};
	  
		switch (this.optionProgress) {
			case 'general':
				datosConsulta = { socios: this.sociosSeleccionados.map(({ value }) => value), empresas: this.empresasSeleccionadas.map(({ value }) => value) };
			break;
			case 'socios':
				datosConsulta = { socios: this.sociosSeleccionados.map(({ value }) => value) };
			break;
			case 'empresas':
				datosConsulta = { empresas: this.empresasSeleccionadas.map(({ value }) => value) };
			break;
		}
	  
		await this.obtenerSociosEmpresas(datosConsulta);
	}

	private obtenerSociosEmpresas (data : any) : Promise<any> {
		return this.apiSocios.obtenerSociosEmpresas(data).toPromise().then(
			respuesta => {
				this.asignarData(respuesta.data);
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private actualizarListaSociosEmpresas () : void {
		let datosConsulta: any = {};
	  
		switch (this.optionProgress) {
			case 'general':
				datosConsulta = { socios: this.sociosSeleccionados.map(({ value }) => value), empresas: this.empresasSeleccionadas.map(({ value }) => value) };
			break;
			case 'socios':
				datosConsulta = { socios: this.sociosSeleccionados.map(({ value }) => value) };
			break;
			case 'empresas':
				datosConsulta = { empresas: this.empresasSeleccionadas.map(({ value }) => value) };
			break;
		}

		this.apiSocios.obtenerSociosEmpresas(datosConsulta).toPromise().then(
			respuesta => {
				this.asignarData(respuesta.data);
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private asignarData ( datosRespuesta : any ) : void {
		switch (this.optionProgress) {
			case 'general':
				this.listaSociosEmpresasGeneral = datosRespuesta;
			break;
			case 'socios':
				this.listaSociosEmpresasSocios = datosRespuesta;
			break;
			case 'empresas':
				this.listaSociosEmpresasEmpresas = datosRespuesta;
			break;
		}
	}

	protected exportarExcel () : void {
		this.mensajes.mensajeEsperar();

		const nombreExcel = 'Socios - Empresas: ' + this.getNowString();

		let datos = [];
		switch (this.optionProgress) {
			case 'general':
				datos = this.listaSociosEmpresasGeneral;
			break;
			case 'socios':
				datos = this.listaSociosEmpresasSocios;
			break;
			case 'empresas':
				datos = this.listaSociosEmpresasEmpresas;
			break;
		}

		this.excelService.exportarExcel(
			datos,
			this.columnasSociosEmpresas,
			nombreExcel
		);
	}

	limpiarGrid () : void {
		switch (this.optionProgress) {
			case 'general':
				this.listaSociosEmpresasGeneral = [];
			break;
			case 'socios':
				this.listaSociosEmpresasSocios = [];
			break;
			case 'empresas':
				this.listaSociosEmpresasEmpresas = [];
			break;
		}
	}

	protected canSearch () : boolean {
		return this.optionProgress == 'general' ?
			   (this.sociosSeleccionados.length != 0 && this.empresasSeleccionadas.length != 0) :
			   (this.sociosSeleccionados.length != 0 || this.empresasSeleccionadas.length != 0);
	}

	protected canExport () : boolean {
		switch (this.optionProgress) {
			case 'general':
				return this.listaSociosEmpresasGeneral.length !== 0;
			case 'socios':
				return this.listaSociosEmpresasSocios.length !== 0;
			case 'empresas':
				return this.listaSociosEmpresasEmpresas.length !== 0;
			default:
				return false;
		}
	}

	protected canClear(): boolean {
		switch (this.optionProgress) {
			case 'general':
				return this.listaSociosEmpresasGeneral.length !== 0;
			case 'socios':
				return this.listaSociosEmpresasSocios.length !== 0;
			case 'empresas':
				return this.listaSociosEmpresasEmpresas.length !== 0;
			default:
				return false;
		}
	}
}