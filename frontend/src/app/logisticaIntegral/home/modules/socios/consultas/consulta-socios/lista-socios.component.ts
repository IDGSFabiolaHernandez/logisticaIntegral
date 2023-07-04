import { Component, ElementRef } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import Option from 'src/app/shared/interfaces/options.interface';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/shared/util/excel.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-lista-socios',
  	templateUrl: './lista-socios.component.html',
  	styleUrls: ['./lista-socios.component.css']
})
export class ListaSociosComponent extends Grid{
	protected opcionesSocios : Option[] = [];
	protected sociosSeleccionados : any[] = [];

	protected columnasSocio : any = {
		'id' 				  : '#',
		'nombreSocio' 		  : 'Socio',
		'status' 			  : 'Status Socio',
		'bloque' 			  : 'Bloque',
		'numEmpresas' 		  : 'Relación Empresas',
		'curpSocio' 		  : 'CURP',
		'rfcSocio' 			  : 'RFC',
		'nombreIntermediario' : 'Intermediario'
	};

	protected tableConfig : any = {
		"nombreSocio" : {
			"updateColumn" : true,
			"value" : "id",
			"idModal" : "modificacionSocio"
		},
		"numEmpresas" : {
			"detailColumn" : true,
			"value" : "id",
			"idModal" : "detalleEnlaceSocioEmpresas"
		}
	};

	protected listaSocios : any[] = [];

	constructor (
		private mensajes : MensajesService,
		private apiSocios : SociosService,
		private excelService : ExcelService
	) {
		super();
	}

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

	protected async refreshSocios () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await this.obtenerSociosSelect();
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de Socios', 'success');
	}

	protected onSelectionChange (data: any) : void {
		if ( data.from == 'socios' ) {
			this.sociosSeleccionados = data.selectedOptions;
		}
	}

	protected consultarSociosPorSelect () : void {
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

	protected exportarExcel () : void {
		this.mensajes.mensajeEsperar();

		const nombreExcel = 'Lista de Socios: ' + this.getNowString();

		this.excelService.exportarExcel(
			this.listaSocios,
			this.columnasSocio,
			nombreExcel
		);
	}

	protected limpiarGrid () : void {
		this.listaSocios = [];
	}

	protected canSearch () : boolean {
		return this.sociosSeleccionados.length != 0;
	}

	protected canExport () : boolean {
		return this.listaSocios.length != 0;
	}

	protected canClear () : boolean {
		return this.listaSocios.length != 0;
	}
}