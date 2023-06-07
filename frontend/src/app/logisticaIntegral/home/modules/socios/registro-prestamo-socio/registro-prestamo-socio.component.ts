import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrestamosService } from 'src/app/logisticaIntegral/services/prestamos/prestamos.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  selector: 'app-registro-prestamo-socio',
  templateUrl: './registro-prestamo-socio.component.html',
  styleUrls: ['./registro-prestamo-socio.component.css']
})
export class RegistroPrestamoSocioComponent extends Grid implements OnInit{
	protected formNuevoPrestamo! : FormGroup;

	public mostrarOpcionesSocios : boolean = false;
	public mostrarOpcionesEmpresas : boolean = false;

	protected datosSocios : any = [];
	protected opcionesEmpresas : any = [];

	constructor (
		private fb : FormBuilder,
		private mensajes : MensajesService,
		private apiPrestamos : PrestamosService
	) {
		super();
	}

	async ngOnInit () : Promise<void> {
		this.crearFormNuevoPrestamo();
		await this.obtenerSocios();
	}

	private crearFormNuevoPrestamo () : void {
		this.formNuevoPrestamo = this.fb.group({
			fechaPrestamo : ['', [Validators.required]],
			nombreSocio : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			montoPrestamo : ['0', [Validators.required, Validators.pattern('[0-9,]*')]],
			observaciones : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	private obtenerSocios () : Promise<any> {
		return this.apiPrestamos.obtenerSociosConRelacionEmpresas().toPromise().then(
			respuesta => {
				this.datosSocios = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	/*private obtenerEmpresas () : Promise<any> {
		return this.apiPrestamos.obtenerEmpresasGenerales().toPromise().then(
			respuesta => {
				this.datosEmpresas = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}*/

	protected onSelectionChange (data: any) : void {
		this.opcionesEmpresas = data.selectedOptions;
	}

	async refresh ( op : string ) : Promise<void> {
		this.mensajes.mensajeEsperar();
		if ( op == 'Socios' ){
			await this.obtenerSocios();
		} else if ( op == 'Empresas' ) {
			//await this.obtenerEmpresas();
		}
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de '+op, 'success');
	}

	protected mostrarPipe(): void {
		const prestamoEntrada = this.formNuevoPrestamo.get('montoPrestamo')?.value;
		let valorSinComas = prestamoEntrada.toString().replace(/,/g, '');

		if(isNaN(valorSinComas)) {
			this.formNuevoPrestamo.get('montoPrestamo')?.setValue(0);
			return;
		}

		valorSinComas = parseInt(valorSinComas) > 0 ? parseInt(valorSinComas) : 0;
		const valorConSeparadores = valorSinComas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		this.formNuevoPrestamo.get('montoPrestamo')?.setValue(valorConSeparadores);
	}
	  

	mostrarOpciones ( op : string ) : void {
		const campoNombre : any = this.formNuevoPrestamo.get( 'nombre'+op )?.value;
		if ( op == 'Socio' ) {
			this.mostrarOpcionesSocios = campoNombre.length > 0;
		} else if ( op == 'Empresa' ) {
			this.mostrarOpcionesEmpresas = campoNombre.length > 0;
		}
		this.formNuevoPrestamo.get( 'nombre'+op )?.setValue( campoNombre.trim() );
	}
}