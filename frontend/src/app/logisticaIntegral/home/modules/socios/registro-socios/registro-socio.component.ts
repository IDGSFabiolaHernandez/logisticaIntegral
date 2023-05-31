import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntermediariosService } from 'src/app/logisticaIntegral/services/intermediarios/intermediarios.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-registro-socios',
  	templateUrl: './registro-socio.component.html',
  	styleUrls: ['./registro-socio.component.css']
})
export class RegistroSociosComponent extends Grid implements OnInit {
	public formDatosPersonalesSocio! : FormGroup;
  	public formDetalleDomicilioSocio! : FormGroup;
	public formDatosIdentificacionSocio! : FormGroup;

	public mostrarOpciones : boolean = false;
	public intermediarios : any = [];

	constructor (
		private mensajes : MensajesService,
		private apiIntermediarios : IntermediariosService,
		private apiSocios : SociosService,
		private fb : FormBuilder
	) {
		super();
	}

	async ngOnInit () : Promise<void> {
		this.crearFormDatosPersonalesSocio();
		this.crearFormDetalleDomicilioSocio();
		this.crearFormDatosIdentificacionSocio();
		await this.obtenerIntermediarios();
	}

	private crearFormDatosPersonalesSocio () : void {
		this.formDatosPersonalesSocio = this.fb.group({
			nombreSocio      : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			status      	 : ['1', [Validators.required]],
			fechaNacimiento  : ['', [Validators.required]],
			curpSocio 	     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			rfcSocio 	     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			estadoCivilSocio : ['', [Validators.required]],
			telefono 	     : ['', [Validators.pattern('[0-9]*')]],
			lugarNacimiento  : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			ocupacion 	     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	private crearFormDetalleDomicilioSocio () : void {
		this.formDetalleDomicilioSocio = this.fb.group({
			direccion : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			colonia   : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			cp 		  : ['', [Validators.required, Validators.pattern('[0-9]*')]],
			localidad : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			estado 	  : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	private crearFormDatosIdentificacionSocio () : void {
		this.formDatosIdentificacionSocio = this.fb.group({
			nombreIntermediario  : ['', [Validators.required]],
			tipoIdentificacion   : ['1', [Validators.required]],
			numeroIdentificacion : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			vigencia             : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			fiel                 : ['1', [Validators.required]],
			fechaInicio          : ['', []],
			observaciones        : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	private obtenerIntermediarios () : Promise<any> {
		return this.apiIntermediarios.obtenerListaSocios().toPromise().then(
			respuesta => {
				this.intermediarios = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected registrarSocio () : void {
		if ( this.formDatosPersonalesSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la información personal.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}
	  
		if ( this.formDetalleDomicilioSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de los detalles del domicilio.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( this.formDatosIdentificacionSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de los datos de identificación.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( !this.validaClienteExistente() ) {
			this.mensajes.mensajeGenerico('Para continuar debe colocar un intermediario existente y valido.', 'info', 'Los campos requeridos están marcados con un *');
			return;
		}

		this.mensajes.mensajeEsperar();

		this.formDatosIdentificacionSocio.value.fkIntermediario = this.obtenerIntermediarioPorNombre(this.formDatosIdentificacionSocio.value.nombreIntermediario).id;

		const datosSocio = {
			...this.formDatosPersonalesSocio.value,
  			...this.formDetalleDomicilioSocio.value,
			...this.formDatosIdentificacionSocio.value
		};

		this.apiSocios.registrarSocio( datosSocio ).subscribe(
			respuesta => {
				if ( respuesta.status != 409 ) {
					this.limpiarFormularios();
					this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
					return;
				}
	
				this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
				return;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	obtenerIntermediarioPorNombre ( nombre : any ) : any {
		const resultado = this.intermediarios.filter( (intermediario : any) =>{
		  	const nombreCompleto : string = intermediario.nombreIntermediario;
		  	return nombreCompleto.trim() == nombre.trim();
		});
	
		return resultado.length > 0 ? resultado[0] : {};
	}

	mostrarOpcionesCliente () : void {
		const campoNombre : any = this.formDatosIdentificacionSocio.get('nombreIntermediario')?.value;
		this.mostrarOpciones = campoNombre.length > 0;
		this.formDatosIdentificacionSocio.get('nombreIntermediario')?.setValue( campoNombre.trim() );
	}

	private validaClienteExistente () : boolean {
		const campoNombre = this.formDatosIdentificacionSocio.get('nombreIntermediario')?.value;
		const registros = this.obtenerIntermediarioPorNombre( campoNombre );
		
		return Object.keys(registros).length != 0 ? true : false;
	}

	limpiarFormularios() : void {
		this.formDatosPersonalesSocio.reset();
		this.formDetalleDomicilioSocio.reset();
		this.formDatosIdentificacionSocio.reset();
		this.formDatosPersonalesSocio.get('status')?.setValue('1');
		this.formDatosPersonalesSocio.get('estadoCivilSocio')?.setValue('');
		this.formDatosIdentificacionSocio.get('tipoIdentificacion')?.setValue('1');
		this.formDatosIdentificacionSocio.get('fiel')?.setValue('1');
	}
}