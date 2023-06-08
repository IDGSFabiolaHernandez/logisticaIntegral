import { Component, OnInit } from '@angular/core';
import { MensualidadesService } from 'src/app/logisticaIntegral/services/mensualidades/mensualidades.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';

@Component({
  	selector: 'app-pago-mensualidades',
  	templateUrl: './pago-mensualidades.component.html',
  	styleUrls: ['./pago-mensualidades.component.css']
})
export class PagoMensualidadesComponent implements OnInit {
	protected fechaPago: string = '';
	protected fechaMensualidadPagar: string = '';
	protected fechaMensualidadPagarEnvio: string = '';
	
	protected opcionesMensualidadesPagar : any = [];

	protected columnasMensualidades : any = {
		'id' 				   : '#',
		'pagar' 			   : 'Pagar',
		'nombreSocio' 		   : 'Socio',
		'activoSocio' 		   : 'Estatus Socio',
		'numEmpresas' 		   : 'Relación Empresas',
		'numPrestamos' 		   : 'Prestamo(s)',
		'importeTotalPrestamo' : 'Importe Prestamo(s)',
		'restantePrestamo' 	   : 'Saldo Prestamo(s)'
	};

	protected tableConfig : any = {
		"pagar" : {
			"checkColumn" : true,
			"value" : "id"
		}
	};

	protected listaMensualidadesPagar : any[] = [];
	private mensualidadesPagar : any[] = [];
	protected totalAPagar : number = 0;
	private montoPagar : number = 5000;

	constructor (
		private apiMensualidades : MensualidadesService,
		private mensajes : MensajesService
	) {

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

		this.apiMensualidades.obtenerMensualidadesPagarPorMensualidad(this.fechaMensualidadPagar).subscribe(
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
	  
		setTimeout(() => {
		  	this.totalAPagar = this.mensualidadesPagar.length * this.montoPagar;
		});
	}

	protected pagarMensualidades () : void {
		this.mensajes.mensajeEsperar();

		const dataMensualidadesPagar = {
			fechaPago : this.fechaPago,
			fechaMensualidadPagar : this.fechaMensualidadPagarEnvio,
			montoPagar : this.montoPagar,
			sociosAPagar : this.mensualidadesPagar
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

	private async actualizarGridDespuesPago () : Promise<void> {
		await this.apiMensualidades.obtenerMensualidadesPagarPorMensualidad(this.fechaMensualidadPagar).toPromise().then(
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

	limpiarGrid () : void {
		this.listaMensualidadesPagar = [];
	}

	canSearch () : boolean {
		return this.fechaMensualidadPagar != '' && this.fechaMensualidadPagar != null && this.fechaMensualidadPagar != undefined;
	}

	canPay () : boolean {
		return this.fechaPago != '' && this.fechaPago != null && this.fechaPago != undefined && this.mensualidadesPagar.length > 0;
	}

	canClear () : boolean {
		return this.listaMensualidadesPagar.length != 0;
	}
}