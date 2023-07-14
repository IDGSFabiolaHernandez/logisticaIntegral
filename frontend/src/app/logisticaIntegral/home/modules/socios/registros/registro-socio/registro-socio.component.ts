import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IntermediariosService } from 'src/app/logisticaIntegral/services/intermediarios/intermediarios.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';
import { RegistroIntermediarioSociosComponent } from '../../../intermediarios/registros/registro-intermediario-socios/registro-intermediario-socios.component';

@Component({
  	selector: 'app-registro-socios',
  	templateUrl: './registro-socio.component.html',
  	styleUrls: ['./registro-socio.component.css']
})
export class RegistroSociosComponent extends Grid implements OnInit, OnDestroy{
	@Input() idModal : any = 0;
	
	protected formDatosPersonalesSocio! : FormGroup;
  	protected formDetalleDomicilioSocio! : FormGroup;
	protected formDatosIdentificacionSocio! : FormGroup;

	public mostrarOpciones : boolean = false;
	protected intermediarios : any = [];

	private countModal : any = 0;

	constructor (
		private mensajes : MensajesService,
		private apiIntermediarios : IntermediariosService,
		private apiSocios : SociosService,
		private fb : FormBuilder,
		private modalService: BsModalService,
		private bsModalRef: BsModalRef
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
			bloque 	 			 : ['', []],
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

	async refresh ( op : string ) : Promise<void> {
		this.mensajes.mensajeEsperar();
		await this.obtenerIntermediarios();
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de '+op, 'success');
	}

	abrirModalRegistroIntermediario () {
		this.countModal += 1;

		this.countModal = '-registro-socio'+this.countModal;
		
		const configModalRegistro: any = {
			backdrop: false,
			ignoreBackdropClick: true,
			keyboard: false,
			animated: true,
			class: 'modal-xl modal-dialog-centered custom-modal modal-registro-intermediario'+this.countModal,
			style: {
				'background-color': 'transparent',
				'overflow-y': 'auto'
			}
		};

		const modalRef: BsModalRef = this.modalService.show(RegistroIntermediarioSociosComponent, configModalRegistro);

		setTimeout(() => {
			const modalBodyElement = document.querySelector('.modal-registro-intermediario' + this.countModal + ' .modal-body');
			const modalFooterElement = document.querySelector('.modal-registro-intermediario' + this.countModal + ' .modal-footer');
		
			if (modalBodyElement && modalFooterElement) {
				modalBodyElement.addEventListener('mousedown', this.onMouseDown.bind(this) as EventListener);
				modalFooterElement.addEventListener('mousedown', this.startResizing.bind(this) as EventListener);
			}
		
			document.body.classList.remove('modal-open');
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
		}, 100);
	}

	mostrarOpcionesIntermediarios () : void {
		const campoNombre : any = this.formDatosIdentificacionSocio.get('nombreIntermediario')?.value;
		this.mostrarOpciones = campoNombre.length > 0;
		this.formDatosIdentificacionSocio.get('nombreIntermediario')?.setValue( campoNombre.trim() );
	}

	protected registrarSocio () : void {
		if ( this.formDatosPersonalesSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información personal.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}
	  
		if ( this.formDetalleDomicilioSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de los Detalles del domicilio.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( this.formDatosIdentificacionSocio.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de los Datos de identificación.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( !this.validaClienteExistente() ) {
			this.mensajes.mensajeGenerico('Para continuar debe colocar un Intermediario existente y valido.', 'info', 'Los campos requeridos están marcados con un *');
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Registrar nuevo Socio').then(
			respuestaMensaje => {
				if (respuestaMensaje.isConfirmed) {
					this.mensajes.mensajeEsperar();
					this.formDatosIdentificacionSocio.value.fkIntermediario = this.obtenerIntermediarioPorNombre(this.formDatosIdentificacionSocio.value.nombreIntermediario).id;

					const datosSocio = {
						socio : {
							...this.formDatosPersonalesSocio.value,
							...this.formDetalleDomicilioSocio.value,
							...this.formDatosIdentificacionSocio.value
						},
						token : localStorage.getItem('token')
					};

					this.apiSocios.registrarSocio( datosSocio ).subscribe(
						respuesta => {
							if ( respuesta.status == 409 ) {
								this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
								return;
							}

							this.limpiarFormularios();
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
		this.formDatosIdentificacionSocio.get('bloque')?.setValue('');
		this.formDatosIdentificacionSocio.get('fiel')?.setValue('1');
	}

	cancelarRegistro() {
		this.limpiarFormularios();
        this.bsModalRef.hide();
    }

	ngOnDestroy(): void {
		this.cancelarRegistro();
	}
}