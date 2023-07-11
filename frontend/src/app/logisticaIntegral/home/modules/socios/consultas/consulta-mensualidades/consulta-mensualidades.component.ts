import { Component } from '@angular/core';
import { EmpresasService } from 'src/app/logisticaIntegral/services/empresas/empresas.service';
import { MensualidadesService } from 'src/app/logisticaIntegral/services/mensualidades/mensualidades.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Option from 'src/app/shared/interfaces/options.interface';
import { ExcelService } from 'src/app/shared/util/excel.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  selector: 'app-consulta-mensualidades',
  templateUrl: './consulta-mensualidades.component.html',
  styleUrls: ['./consulta-mensualidades.component.css']
})
export class ConsultaMensualidadesComponent extends Grid{
  	protected opcionesSocios : Option[] = [];
	protected sociosSeleccionados : any[] = [];

	protected opcionesEmpresas : Option[] = [];
	protected empresasSeleccionadas : any[] = [];

	protected opcionesMensualidades : Option[] = [];
	protected mensualidadesSeleccionadas : any[] = [];

  	protected columnasMensualidades : any = {
		id            : '#',
		folio         : 'Folio',
		nombreEmpresa : 'Empresa',
		nombreSocio   : 'Socio',
		mensualidad   : 'Mensualidad Pagada',
		cantidad      : 'Cantidad Pagada',
		abonoPrestamo : 'Abono a Préstamo',
		fechaPago     : 'Fecha de Pago'
	};

	protected tableConfig : any = {
		"cantidad" : {
			"moneyColumn" : true
		},
		"abonoPrestamo" : {
			"moneyColumn" : true,
			"style" : {
				"color" : "red",
				"font-weight" : "bold"
			}
		}
	};

	protected listaMensualidadesSocios : any[] = [];
	protected listaMensualidadesEmpresas : any[] = [];

	protected searchOptions = ['socios', 'empresas'];
	protected optionProgress : string = 'socios';

	constructor (
		private mensajes : MensajesService,
		private apiSocios : SociosService,
		private apiEmpresas : EmpresasService,
		private apiMensualidades : MensualidadesService,
		private excelService : ExcelService
	) {
		super();
	}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await Promise.all([
			this.obtenerSociosMensualidadesSelect(),
			this.obtenerEmpresasMensualidadesSelect(),
			this.obtenerMensualidadesPagadasSelect()
		]);
		this.mensajes.cerrarMensajes();
	}

	private obtenerSociosMensualidadesSelect () : Promise<any> {
		return this.apiSocios.obtenerSociosMensualidadesSelect().toPromise().then(
			respuesta => {
				this.opcionesSocios = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private obtenerEmpresasMensualidadesSelect () : Promise<any> {
		return this.apiEmpresas.obtenerEmpresasMensualidadesSelect().toPromise().then(
			respuesta => {
				this.opcionesEmpresas = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private obtenerMensualidadesPagadasSelect () : Promise<any> {
		return this.apiMensualidades.obtenerMensualidadesPagadasSelect().toPromise().then(
			respuesta => {
				this.opcionesMensualidades = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	async refresh ( op : string ) : Promise<void> {
		this.mensajes.mensajeEsperar();
		if ( op == 'Socios' ){
			await this.obtenerSociosMensualidadesSelect();
		} else if ( op == 'Empresas' ) {
			await this.obtenerEmpresasMensualidadesSelect();
		} else if ( op == 'Mensualidades' ) {
			await this.obtenerMensualidadesPagadasSelect();
		}
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de '+op, 'success');
	}

	protected onSelectionChange (data: any) : void {
		if ( data.from == 'socios' ) {
			this.sociosSeleccionados = data.selectedOptions;
		} else if ( data.from == 'empresas' ) {
			this.empresasSeleccionadas = data.selectedOptions;
		} else if ( data.from == 'mensualidades' ) {
			this.mensualidadesSeleccionadas = data.selectedOptions;
		}
	}

	protected cambioGrid ( op : number ) : void {
		this.optionProgress = this.searchOptions[op];
	}

	protected validarSelect ( op : string ) : boolean {
		return this.optionProgress == op;
	}

	protected async consultarOptionProgress(): Promise<void> {
		this.mensajes.mensajeEsperar();
		let datosConsulta: any = {};
	  
		switch (this.optionProgress) {
			case 'socios':
				datosConsulta = { socios: this.sociosSeleccionados.map(({ value }) => value), mensualidades: this.mensualidadesSeleccionadas.map(({ value }) => value) };
			break;
			case 'empresas':
				datosConsulta = { empresas: this.empresasSeleccionadas.map(({ value }) => value), mensualidades: this.mensualidadesSeleccionadas.map(({ value }) => value) };
			break;
		}
	  
		await this.obtenerMensualidades(datosConsulta);
	}

	private obtenerMensualidades (data : any) : Promise<any> {
		return this.apiMensualidades.obtenerMensualidades(data).toPromise().then(
			respuesta => {
				this.asignarData(respuesta.data);
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private asignarData ( datosRespuesta : any ) : void {
		switch (this.optionProgress) {
			case 'socios':
				this.listaMensualidadesSocios = datosRespuesta;
			break;
			case 'empresas':
				this.listaMensualidadesEmpresas = datosRespuesta;
			break;
		}
	}

	protected exportarExcel () : void {
		this.mensajes.mensajeEsperar();

		const nombreExcel = 'Mensualidades Pagadas: ' + this.getNowString();

		let datos = [];

		switch (this.optionProgress) {
			case 'socios':
				datos = this.listaMensualidadesSocios;
			break;
			case 'empresas':
				datos = this.listaMensualidadesEmpresas;
			break;
		}

		this.excelService.exportarExcel(
			datos,
			this.columnasMensualidades,
			nombreExcel
		);
	}

	limpiarGrid () : void {
		switch (this.optionProgress) {
			case 'socios':
				this.listaMensualidadesSocios = [];
			break;
			case 'empresas':
				this.listaMensualidadesEmpresas = [];
			break;
		}
	}

	protected canSearch () : boolean {
		return this.optionProgress == 'socios' ?
			   (this.sociosSeleccionados.length != 0 && this.mensualidadesSeleccionadas.length != 0) :
			   (this.sociosSeleccionados.length != 0 && this.mensualidadesSeleccionadas.length != 0);
	}

	protected canExport () : boolean {
		switch (this.optionProgress) {
			case 'socios':
				return this.listaMensualidadesSocios.length !== 0;
			case 'empresas':
				return this.listaMensualidadesEmpresas.length !== 0;
			default:
				return false;
		}
	}

	protected canClear(): boolean {
		switch (this.optionProgress) {
			case 'socios':
				return this.listaMensualidadesSocios.length !== 0;
			case 'empresas':
				return this.listaMensualidadesEmpresas.length !== 0;
			default:
				return false;
		}
	}
}
