import { Component, OnInit } from '@angular/core';
import { PrestamosService } from 'src/app/logisticaIntegral/services/prestamos/prestamos.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Option from 'src/app/shared/interfaces/options.interface';

@Component({
  	selector: 'app-consulta-prestamos-socios',
  	templateUrl: './consulta-prestamos-socios.component.html',
  	styleUrls: ['./consulta-prestamos-socios.component.css']
})
export class ConsultaPrestamosSociosComponent implements OnInit{
	protected opcionesSocios : Option[] = [];
	protected sociosSeleccionados : any[] = [];

	protected opcionesStatus : Option[] = [
		{ value : '0', label : 'Pendiente(s)', checked : false },
		{ value : '1', label : 'Pagado(s)', checked : false }
	];
	protected statusSeleccionados : any[] = [];

	protected columnasSocio : any = {
		id             : '#',
		nombreSocio    : 'Socio',
		numEmpresas    : 'Empresa Mensualidad',
		montoPrestamo  : 'Importe ',
		aCuenta        : 'A Cuenta ',
		saldo          : 'Saldo ',
		fechaPrestamo  : 'Fecha Prestamo ',
		statusPrestamo : 'Estatus Prestamo '
	};

	protected listaSocios : any[] = [];

	constructor (
		private mensajes : MensajesService,
		private apiPrestamos : PrestamosService
	) {

	}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await this.obtenerSociosSelect();
		this.mensajes.cerrarMensajes();
	}

	private obtenerSociosSelect () : Promise<any> {
		return this.apiPrestamos.obtenerSociosConPrestamos().toPromise().then(
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
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de los Socios que tienen/tuvieron préstamos', 'success');
	}

	onSelectionChange (data: any) : void {
		if ( data.from == 'socios' ) {
			this.sociosSeleccionados = data.selectedOptions;
		} else if ( data.from == 'status' ) {
			this.statusSeleccionados = data.selectedOptions;
		}
	}

	consultarSociosPorSelect () : void {
		this.mensajes.mensajeEsperar();
		const datosSocios = { socios : this.sociosSeleccionados.map(({value}) => value), status : this.statusSeleccionados.map(({value}) => value) };

		this.apiPrestamos.obtenerPrestamosPorSociosYStatus(datosSocios).subscribe(
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
		return this.sociosSeleccionados.length != 0 && this.statusSeleccionados.length != 0;
	}

	canClear () : boolean {
		return this.listaSocios.length != 0;
	}
}
