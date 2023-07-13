import { Component, OnInit } from '@angular/core';
import { MensualidadesService } from 'src/app/logisticaIntegral/services/mensualidades/mensualidades.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Option from 'src/app/shared/interfaces/options.interface';
import { ExcelService } from 'src/app/shared/util/excel.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-pago-mensualidades',
  	templateUrl: './pago-mensualidades.component.html',
  	styleUrls: ['./pago-mensualidades.component.css']
})
export class PagoMensualidadesComponent extends Grid implements OnInit {
	protected fechaPago: string = '';
	protected fechaMensualidadPagar: string = '';
	protected fechaMensualidadPagarEnvio: string = '';
	
	protected opcionesMensualidadesPagar : any = [];

	protected opcionesBloques : Option[] = [
		{ value : '1', label : 'Bloque 1', checked : false },
		{ value : '2', label : 'Bloque 2', checked : false },
		{ value : '3', label : 'Bloque 3', checked : false },
		{ value : '4', label : 'Bloque 4', checked : false },
		{ value : '5', label : 'Bloque 5', checked : false },
		{ value : '6', label : 'Bloque 6', checked : false },
		{ value : '7', label : 'Bloque 7', checked : false }
	];

	private bloquesSeleccionados : any[] = [];

	protected columnasMensualidades : any = {
		'id' 				   : '#',
		'pagar' 			   : 'Pagar',
		'nombreSocio' 		   : 'Socio',
		'bloque' 		       : 'Bloque',
		'numEmpresas' 		   : 'Relación Empresas',
		'numPrestamos' 		   : 'Prestamo(s)',
		'importeTotalPrestamo' : 'Importe Prestamo(s)',
		'restantePrestamo' 	   : 'Saldo Prestamo(s)'
	};

	protected tableConfig : any = {
		"pagar" : {
			"checkColumn" : true,
			"value" : "id"
		},
		"importeTotalPrestamo" : {
			"moneyColumn" : true,
			"style" : {
				"color" : "red",
				"font-weight" : "bold"
			}
		},
		"restantePrestamo" : {
			"moneyColumn" : true,
			"style" : {
				"color" : "red",
				"font-weight" : "bold"
			}
		},
		"bloque": {
			"selectColumn": true,
        	"selectOptions": [
				'Bloque 1',
				'Bloque 2',
				'Bloque 3',
				'Bloque 4',
				'Bloque 5',
				'Bloque 6',
				'Bloque 7'
			],
			"showEmptyOption": true
		},
	};

	protected listaMensualidadesPagar : any[] = [];
	private mensualidadesPagar : any[] = [];
	protected totalAPagar : number = 0;
	private montoPagar : number = 5000;

	constructor (
		private apiMensualidades : MensualidadesService,
		private mensajes : MensajesService,
		private excelService : ExcelService
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this.mensajes.mensajeEsperar();
		await Promise.all([
			this.obtenerMensualidadesPagarSelect()
		]);
		this.mensajes.cerrarMensajes();
	}

	private obtenerMensualidadesPagarSelect () : Promise<void> {
		return this.apiMensualidades.obtenerMensualidadesPagarSelect().toPromise().then(
			respuesta => {
				this.opcionesMensualidadesPagar = respuesta.data ?? [];
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected obtenerMensualidadesPagarPorMensualidad () : void {
		this.mensajes.mensajeEsperar();

		const data = {
			mensualidad : this.fechaMensualidadPagar,
			bloques : this.bloquesSeleccionados.map(({value}) => value)
		};

		this.apiMensualidades.obtenerMensualidadesPagarPorMensualidad(data).subscribe(
			respuesta => {
				this.listaMensualidadesPagar = respuesta.data;
				this.fechaMensualidadPagarEnvio = this.fechaMensualidadPagar;
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected obtenerSociosAPagar(data: any): void {
		this.mensualidadesPagar = data.selectedOptions;
	
		const sumatoria = this.mensualidadesPagar.reduce((acumulador, id) => {
			const empresa = this.listaMensualidadesPagar.find(e => e.id === id);
			return acumulador + (empresa ? empresa.numEmpresas : 0);
		}, 0);
	
		setTimeout(() => {
			this.totalAPagar = sumatoria * this.montoPagar;
		});
	}

	protected onSelectionChange (data: any) : void {
		if ( data.from == 'bloques' ) {
			this.bloquesSeleccionados = data.selectedOptions;
		}
	}

	protected pagarMensualidades () : void {
		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Pagar Mensualidad(es)').then(
			respuestaMensaje => {
				if ( respuestaMensaje.isConfirmed ) {
					this.mensajes.mensajeEsperar();

					const dataMensualidadesPagar = {
						fechaPago             : this.fechaPago,
						fechaMensualidadPagar : this.fechaMensualidadPagarEnvio,
						montoPagar            : this.montoPagar,
						sociosAPagar          : this.mensualidadesPagar,
						token                 : localStorage.getItem('token')
					};
			
					this.apiMensualidades.pagarMensualidadEmpresaSocio(dataMensualidadesPagar).subscribe(
						respuesta => {
							this.actualizarGridDespuesPago().then(() => {
								this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
								return;
							});
							return;
						}, error => {
							this.mensajes.mensajeGenerico('error', 'error');
						}
					);
				}
			}
		);
	}

	private async actualizarGridDespuesPago () : Promise<void> {
		const data = {
			mensualidad : this.fechaMensualidadPagarEnvio,
			bloques : this.bloquesSeleccionados.map(({value}) => value)
		};

		await this.apiMensualidades.obtenerMensualidadesPagarPorMensualidad(data).toPromise().then(
			respuesta => {
				this.listaMensualidadesPagar = respuesta.data ?? [];
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);

		if ( this.listaMensualidadesPagar.length == 0 ) {
			await this.obtenerMensualidadesPagarSelect();
		}
	}

	protected exportarExcel () : void {
		this.mensajes.mensajeEsperar();

		const nombreExcel = 'Mensualidades por Pagar: ' + this.getNowString();
		const columnasEspeciales  = {
			'id' 				   : '#',
			'nombreSocio' 		   : 'Socio',
			'numEmpresas' 		   : 'Relación Empresas',
			'numPrestamos' 		   : 'Prestamo(s)',
			'importeTotalPrestamo' : 'Importe Prestamo(s)',
			'restantePrestamo' 	   : 'Saldo Prestamo(s)'
		};

		this.excelService.exportarExcel(
			this.listaMensualidadesPagar,
			columnasEspeciales,
			nombreExcel
		);
	}

	protected limpiarGrid () : void {
		this.listaMensualidadesPagar = [];
	}

	protected canSearch () : boolean {
		return this.fechaMensualidadPagar != '' && this.fechaMensualidadPagar != null && this.fechaMensualidadPagar != undefined && this.bloquesSeleccionados.length != 0;
	}
	
	protected canExport () : boolean {
		return this.listaMensualidadesPagar.length != 0;
	}

	protected canPay () : boolean {
		return this.fechaPago != '' && this.fechaPago != null && this.fechaPago != undefined && this.mensualidadesPagar.length > 0;
	}

	protected canClear () : boolean {
		return this.listaMensualidadesPagar.length != 0;
	}
}