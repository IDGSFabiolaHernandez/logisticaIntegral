import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresasService } from 'src/app/logisticaIntegral/services/empresas/empresas.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-registro-enlace-socio-empresa',
  	templateUrl: './registro-enlace-socio-empresa.component.html',
  	styleUrls: ['./registro-enlace-socio-empresa.component.css']
})
export class RegistroEnlaceSociosEmpresasComponent extends Grid implements OnInit, OnDestroy{
	@Input() noQuitClass : boolean = false;
	
	protected formEnlaceSocioEmpresa! : FormGroup;

	public mostrarOpcionesSocios : boolean = false;
	public mostrarOpcionesEmpresas : boolean = false;

	protected datosSocios : any = [];
	protected datosEmpresas : any = [];

	protected statusSocio : string = '';
	protected statusEmpresa : string = '';

	private opStatusSocio : string[] = [
		'Inactivo',
		'Activo'
	];

	private opStatusEmpresa : string[] = [
		'Activa',
		'X suspender',
		'En proceso',
		'Inactiva',
		'Maquila cliente',
		'Cuenta bancaria'
	];

	constructor (
		private fb : FormBuilder,
		private mensajes : MensajesService,
		private apiSocios  : SociosService,
		private apiEmpresas : EmpresasService,
		private bsModalRef: BsModalRef
	) {
		super();
	}

	async ngOnInit () : Promise<void> {
		this.crearFormEnlaceSocioEmpresa();
		await Promise.all([
			this.obtenerSocios(),
			this.obtenerEmpresas()
		]);
	}

	private crearFormEnlaceSocioEmpresa () : void {
		this.formEnlaceSocioEmpresa = this.fb.group({
			nombreSocio : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			nombreEmpresa : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			mesIngreso : ['', []],
			tipoInstrumento : ['', [Validators.required]],
			numeroInstrumento : ['', []],
			observaciones : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
	}

	async refresh ( op : string ) : Promise<void> {
		this.mensajes.mensajeEsperar();
		if ( op == 'Socios' ){
			await this.obtenerSocios();
		} else if ( op == 'Empresas' ) {
			await this.obtenerEmpresas();
		}
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de '+op, 'success');
	}

	private obtenerSocios () : Promise<any> {
		return this.apiSocios.obtenerSociosGenerales().toPromise().then(
			respuesta => {
				this.datosSocios = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private obtenerEmpresas () : Promise<any> {
		return this.apiEmpresas.obtenerEmpresasGenerales().toPromise().then(
			respuesta => {
				this.datosEmpresas = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	mostrarOpciones ( op : string ) : void {
		const campoNombre : any = this.formEnlaceSocioEmpresa.get( 'nombre'+op )?.value;
		if ( op == 'Socio' ) {
			this.mostrarOpcionesSocios = campoNombre.length > 0;
			this.statusSocio = this.validaSocioExistente() ?
							   this.opStatusSocio[this.obtenerSocioPorNombre(campoNombre.trim()).status] :
							   '';
		} else if ( op == 'Empresa' ) {
			this.mostrarOpcionesEmpresas = campoNombre.length > 0;
			this.statusEmpresa = this.validaEmpresaExistente() ?
								 this.opStatusEmpresa[this.obtenerEmpresaPorNombre(campoNombre.trim()).status - 1] :
								 '';
		}
		this.formEnlaceSocioEmpresa.get( 'nombre'+op )?.setValue( campoNombre.trim() );

		this.validaStatusEmpresa();
	}

	private validaStatusEmpresa () : void {
		if ( this.statusEmpresa != 'En proceso' ) {
			this.formEnlaceSocioEmpresa.get('mesIngreso')?.setValidators([Validators.required]);
			this.formEnlaceSocioEmpresa.get('mesIngreso')?.updateValueAndValidity();
			this.formEnlaceSocioEmpresa.get('numeroInstrumento')?.setValidators([Validators.required, Validators.pattern('[0-9]*')]);
			this.formEnlaceSocioEmpresa.get('numeroInstrumento')?.updateValueAndValidity();
		} else {
			this.formEnlaceSocioEmpresa.get('mesIngreso')?.clearValidators();
			this.formEnlaceSocioEmpresa.get('mesIngreso')?.updateValueAndValidity();
			this.formEnlaceSocioEmpresa.get('numeroInstrumento')?.clearValidators();
			this.formEnlaceSocioEmpresa.get('numeroInstrumento')?.updateValueAndValidity();
		}
	}

	obtenerSocioPorNombre ( nombre : any ) : any {
		const resultado = this.datosSocios.filter( (socio : any) =>{
		  	const nombreCompleto : string = socio.nombreSocio;
		  	return nombreCompleto.trim() == nombre.trim();
		});
	
		return resultado.length > 0 ? resultado[0] : {};
	}

	obtenerEmpresaPorNombre ( nombre : any ) : any {
		const resultado = this.datosEmpresas.filter( (empresa : any) =>{
		  	const nombreCompleto : string = empresa.nombre;
		  	return nombreCompleto.trim() == nombre.trim();
		});
	
		return resultado.length > 0 ? resultado[0] : {};
	}

	protected registrarEnlaceSocioEmpresa () : void {
		if ( !this.validaSocioExistente() ) {
			this.mensajes.mensajeGenerico('Para continuar debe colocar un Socio existente y valido.', 'info', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( !this.validaEmpresaExistente() ) {
			this.mensajes.mensajeGenerico('Para continuar debe colocar una Empresa existente y valida.', 'info', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( this.formEnlaceSocioEmpresa.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Registrar enlace Socio-Empresa').then(
			respuestaMensaje => {
				if ( respuestaMensaje.isConfirmed ) {
					this.mensajes.mensajeEsperar();
					this.formEnlaceSocioEmpresa.value.fkSocio = this.obtenerSocioPorNombre(this.formEnlaceSocioEmpresa.value.nombreSocio).id;
					this.formEnlaceSocioEmpresa.value.fkEmpresa = this.obtenerEmpresaPorNombre(this.formEnlaceSocioEmpresa.value.nombreEmpresa).id;

					const dataEnlace = {
						'enlace' : this.formEnlaceSocioEmpresa.value,
						'token'  : localStorage.getItem('token')
					};

					this.apiSocios.generarEnlaceSocioEmpresa(dataEnlace).subscribe(
						respuesta => {
							if ( respuesta.status == 409 ) {
								this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
								return;
							}

							this.limpiarFormulario();
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

	private validaSocioExistente () : boolean {
		const campoNombre = this.formEnlaceSocioEmpresa.get('nombreSocio')?.value;
		const registros = this.obtenerSocioPorNombre( campoNombre );
		
		return Object.keys(registros).length != 0 ? true : false;
	}

	private validaEmpresaExistente () : boolean {
		const campoNombre = this.formEnlaceSocioEmpresa.get('nombreEmpresa')?.value;
		const registros = this.obtenerEmpresaPorNombre( campoNombre );
		
		return Object.keys(registros).length != 0 ? true : false;
	}

	limpiarFormulario() : void {
		this.formEnlaceSocioEmpresa.reset();
		this.statusSocio = '';
		this.statusEmpresa = '';
		this.mostrarOpcionesSocios = false;
		this.mostrarOpcionesEmpresas = false;
		this.formEnlaceSocioEmpresa.get('tipoInstrumento')?.setValue('');
	}

	cancelarRegistro() {
		this.limpiarFormulario();
        this.bsModalRef.hide();
		if ( !this.noQuitClass ) {
			document.body.classList.remove('modal-open');
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
		}
    }

	ngOnDestroy(): void {
		this.cancelarRegistro();
	}
}