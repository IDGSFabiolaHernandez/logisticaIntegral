import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IntermediariosService } from 'src/app/logisticaIntegral/services/intermediarios/intermediarios.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';
import { RegistroIntermediarioSociosComponent } from '../../../intermediarios/registros/registro-intermediario-socios/registro-intermediario-socios.component';

@Component({
  	selector: 'app-modificacion-socio',
  	templateUrl: './modificacion-socio.component.html',
  	styleUrls: ['./modificacion-socio.component.css']
})
export class ModificacionSocioComponent extends Grid implements OnInit, OnDestroy {
	@Input() idDetalle: number = 0;

	protected formModDatosPersonalesSocio! : FormGroup;
  	protected formModDetalleDomicilioSocio! : FormGroup;
	protected formModDatosIdentificacionSocio! : FormGroup;

	public mostrarOpciones : boolean = false;
	protected intermediarios : any = [];

	protected detalleSocio : any;

	constructor (
		private mensajes : MensajesService,
		private apiIntermediarios : IntermediariosService,
		private apiSocios : SociosService,
		private fb : FormBuilder,
		private bsModalRef: BsModalRef,
		private modalService: BsModalService
	) {
		super();
	}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		this.crearFormModDatosPersonalesSocio();
		this.crearFormModDetalleDomicilioSocio();
		this.crearFormModDatosIdentificacionSocio();
		await Promise.all([
			this.obtenerIntermediarios(),
			this.obtenerDetalleSocioPorId(this.idDetalle)
		]);
	}

	private crearFormModDatosPersonalesSocio () : void {
		this.formModDatosPersonalesSocio = this.fb.group({
			nombreSocio      : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			status      	 : ['', [Validators.required]],
			fechaNacimiento  : ['', [Validators.required]],
			curpSocio 	     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			rfcSocio 	     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			estadoCivilSocio : ['', [Validators.required]],
			telefono 	     : ['', [Validators.pattern('[0-9]*')]],
			lugarNacimiento  : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			ocupacion 	     : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	private crearFormModDetalleDomicilioSocio () : void {
		this.formModDetalleDomicilioSocio = this.fb.group({
			direccion : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			colonia   : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			cp 		  : ['', [Validators.required, Validators.pattern('[0-9]*')]],
			localidad : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			estado 	  : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	private crearFormModDatosIdentificacionSocio () : void {
		this.formModDatosIdentificacionSocio = this.fb.group({
			nombreIntermediario  : ['', [Validators.required]],
			tipoIdentificacion   : ['', [Validators.required]],
			numeroIdentificacion : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			vigencia             : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			fiel                 : ['', [Validators.required]],
			fechaInicio          : ['', []],
			fechaFin             : ['', []],
			modificarBloque 	 : ['1', [Validators.required]],
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

	async refresh () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await this.obtenerIntermediarios();
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de Socios', 'success');
	}

	abrirModalRegistroIntermediario () {
		const data = {
			noQuitClass : true
		};

		const configModalModificacion: any = {
			backdrop: false,
			ignoreBackdropClick: true,
			keyboard: false,
			animated: true,
			initialState: data,
			class: 'modal-lg modal-dialog-centered custom-modal',
			style: {
				'background-color': 'transparent',
				'overflow-y': 'auto'
			}
		};

		const modalRef: BsModalRef = this.modalService.show(RegistroIntermediarioSociosComponent, configModalModificacion);
	}

	private obtenerDetalleSocioPorId ( idSocio : number ) : Promise<any> {
		return this.apiSocios.obtenerDetalleSocioPorId( idSocio ).toPromise().then(
			respuesta => {
				this.detalleSocio = respuesta.data[0];
				this.cargarFormulariosModificacion();
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private cargarFormulariosModificacion () : void {
		this.formModDatosPersonalesSocio.get('nombreSocio')?.setValue(this.detalleSocio.nombreSocio);
		this.formModDatosPersonalesSocio.get('status')?.setValue((this.detalleSocio.status ?? '').toString());
		this.formModDatosPersonalesSocio.get('fechaNacimiento')?.setValue(this.detalleSocio.fechaNacimiento);
		this.formModDatosPersonalesSocio.get('curpSocio')?.setValue(this.detalleSocio.curpSocio);
		this.formModDatosPersonalesSocio.get('rfcSocio')?.setValue(this.detalleSocio.rfcSocio);
		this.formModDatosPersonalesSocio.get('estadoCivilSocio')?.setValue(this.detalleSocio.estadoCivilSocio);
		this.formModDatosPersonalesSocio.get('telefono')?.setValue(this.detalleSocio.telefono);
		this.formModDatosPersonalesSocio.get('lugarNacimiento')?.setValue(this.detalleSocio.lugarNacimiento);
		this.formModDatosPersonalesSocio.get('ocupacion')?.setValue(this.detalleSocio.ocupacion);

		this.formModDetalleDomicilioSocio.get('direccion')?.setValue(this.detalleSocio.direccion);
		this.formModDetalleDomicilioSocio.get('colonia')?.setValue(this.detalleSocio.colonia);
		this.formModDetalleDomicilioSocio.get('cp')?.setValue(this.detalleSocio.cp);
		this.formModDetalleDomicilioSocio.get('localidad')?.setValue(this.detalleSocio.localidad);
		this.formModDetalleDomicilioSocio.get('estado')?.setValue(this.detalleSocio.estado);
		
		this.formModDatosIdentificacionSocio.get('nombreIntermediario')?.setValue(this.detalleSocio.nombreIntermediario);
		this.formModDatosIdentificacionSocio.get('tipoIdentificacion')?.setValue((this.detalleSocio.tipoIdentificacion ?? '').toString());
		this.formModDatosIdentificacionSocio.get('numeroIdentificacion')?.setValue(this.detalleSocio.numeroIdentificacion);
		this.formModDatosIdentificacionSocio.get('vigencia')?.setValue(this.detalleSocio.vigencia);
		this.formModDatosIdentificacionSocio.get('fiel')?.setValue((this.detalleSocio.fiel ?? '').toString());
		this.formModDatosIdentificacionSocio.get('fechaInicio')?.setValue(this.detalleSocio.fechaInicio);
		this.formModDatosIdentificacionSocio.get('fechaFin')?.setValue(this.detalleSocio.fechaFin);
		this.formModDatosIdentificacionSocio.get('modificarBloque')?.setValue(this.detalleSocio.bloque ?? '');
		this.formModDatosIdentificacionSocio.get('observaciones')?.setValue(this.detalleSocio.observaciones);
	}

	mostrarOpcionesIntermediarios () : void {
		const campoNombre : any = this.formModDatosIdentificacionSocio.get('nombreIntermediario')?.value;
		this.mostrarOpciones = campoNombre.length > 0;
		this.formModDatosIdentificacionSocio.get('nombreIntermediario')?.setValue( campoNombre.trim() );
	}

	protected modificarSocio () : void {
		if ( this.formModDatosPersonalesSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información personal.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}
	  
		if ( this.formModDetalleDomicilioSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de los Detalles del domicilio.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( this.formModDatosIdentificacionSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de los Datos de identificación.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( !this.validaClienteExistente() ) {
			this.mensajes.mensajeGenerico('Para continuar debe colocar un Intermediario existente y valido.', 'info', 'Los campos requeridos están marcados con un *');
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Socio').then(
			respuestaMensaje => {
				if (respuestaMensaje.isConfirmed) {
					this.mensajes.mensajeEsperar();
					this.formModDatosIdentificacionSocio.value.fkIntermediario = this.obtenerIntermediarioPorNombre(this.formModDatosIdentificacionSocio.value.nombreIntermediario).id;

					const datosSocio = {
						socioModificado : {
							...this.formModDatosPersonalesSocio.value,
							...this.formModDetalleDomicilioSocio.value,
							...this.formModDatosIdentificacionSocio.value
						},
						idSocio : this.idDetalle,
						token : localStorage.getItem('token')
					};

					this.apiSocios.modificarSocio( datosSocio ).subscribe(
						respuesta => {
							if ( respuesta.status == 409 ) {
								this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
								return;
							}

							this.cancelarModificacion();
							this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
							return;
						}, error => {
							this.mensajes.mensajeGenerico('error', 'error');
						}
					);
				}
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

	private validaClienteExistente () : boolean {
		const campoNombre = this.formModDatosIdentificacionSocio.get('nombreIntermediario')?.value;
		const registros = this.obtenerIntermediarioPorNombre( campoNombre );
		
		return Object.keys(registros).length != 0 ? true : false;
	}

	limpiarFormularios() : void {
		this.formModDatosPersonalesSocio.reset();
		this.formModDetalleDomicilioSocio.reset();
		this.formModDatosIdentificacionSocio.reset();
		this.formModDatosIdentificacionSocio.get('modificarBloque')?.setValue('');
	}

	cancelarModificacion() {
		this.limpiarFormularios();
		this.idDetalle = 0;
        this.bsModalRef.hide();
		document.body.classList.remove('modal-open');
		document.body.style.paddingRight = '';
		document.body.style.overflow = '';
    }

	ngOnDestroy(): void {
		this.limpiarFormularios();
		this.idDetalle = 0;
	}
}