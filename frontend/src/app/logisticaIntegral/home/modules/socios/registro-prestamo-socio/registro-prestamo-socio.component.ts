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

	protected datosSocios : any = [];
	public mostrarOpcionesSocios : boolean = false;

	protected opcionesEmpresas : any = [];
	protected empresasSeleccionadas : any[] = [];

	private idSocio : number = 0;

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

	private obtenerEmpresasPorSocio ( idSocio : number ) : Promise<any> {
		this.mensajes.mensajeEsperar();
		return this.apiPrestamos.obtenerEmpresasSelectPorSocio( idSocio ).toPromise().then(
			respuesta => {
				this.opcionesEmpresas = respuesta.data;
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected onSelectionChange (data: any) : void {
		this.empresasSeleccionadas = data.selectedOptions;
	} 

	mostrarOpcionesSocio () : void {
		const campoNombre : any = this.formNuevoPrestamo.get( 'nombreSocio' )?.value;
		this.mostrarOpcionesSocios = campoNombre.length > 0;
		this.formNuevoPrestamo.get( 'nombreSocio' )?.setValue( campoNombre.trim() );
		if ( this.validaSocioExistente() ) {
			this.idSocio = this.obtenerSocioPorNombre(campoNombre.trim()).id;
			this.obtenerEmpresasPorSocio(this.idSocio);
		} else {
			this.opcionesEmpresas = [];
			this.idSocio = 0;
		}
	}

	async refresh ( op : string ) : Promise<void> {
		this.mensajes.mensajeEsperar();
		if ( op == 'Socios' ){
			await this.obtenerSocios();
			this.mensajes.mensajeGenericoToast('Se actualizó la lista de los Socios que tienen relación con Empresas', 'success');
		} else if ( op == 'Empresas' ) {
			await this.obtenerEmpresasPorSocio(this.idSocio);
			this.mensajes.mensajeGenericoToast('Se actualizó la lista de las Empresas con las que tiene relación el Socio', 'success');
		}
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

	private obtenerSocioPorNombre ( nombre : any ) : any {
		const resultado = this.datosSocios.filter( (socio : any) =>{
		  	const nombreCompleto : string = socio.nombreSocio;
		  	return nombreCompleto.trim() == nombre.trim();
		});
	
		return resultado.length > 0 ? resultado[0] : {};
	}

	private validaSocioExistente () : boolean {
		const campoNombre = this.formNuevoPrestamo.get('nombreSocio')?.value;
		const registros = this.obtenerSocioPorNombre( campoNombre );
		
		return Object.keys(registros).length != 0 ? true : false;
	}

	limpiarFormulario() : void {
		this.opcionesEmpresas = [];
		this.idSocio = 0;
		this.formNuevoPrestamo.reset();
		this.formNuevoPrestamo.get('montoPrestamo')?.setValue('0');
	}
}