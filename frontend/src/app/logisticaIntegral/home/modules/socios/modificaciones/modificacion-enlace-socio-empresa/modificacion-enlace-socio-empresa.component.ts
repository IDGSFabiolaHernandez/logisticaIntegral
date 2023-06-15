import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresasService } from 'src/app/logisticaIntegral/services/empresas/empresas.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-modificacion-enlace-socio-empresa',
  	templateUrl: './modificacion-enlace-socio-empresa.component.html',
  	styleUrls: ['./modificacion-enlace-socio-empresa.component.css']
})
export class ModificacionEnlaceSocioEmpresaComponent extends Grid implements OnInit, OnDestroy{
	@Input() idDetalle: number = 0;

	protected formModEnlaceSocioEmpresa! : FormGroup;

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

	protected detalleSocioEmpresa : any;

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
		this.mensajes.mensajeEsperar();
		this.crearFormEnlaceSocioEmpresa();
		await Promise.all([
			this.obtenerSocios(),
			this.obtenerEmpresas(),
			this.obtenerDetalleSocioEmpresaPorId(this.idDetalle)
		]);
	}

	private crearFormEnlaceSocioEmpresa () : void {
		this.formModEnlaceSocioEmpresa = this.fb.group({
			nombreSocio : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			nombreEmpresa : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			mesIngreso : ['', [Validators.required]],
			mesSalida : ['', []],
			tipoInstrumento : ['', [Validators.required]],
			numeroInstrumento : ['', [Validators.required, Validators.pattern('[0-9]*')]],
			observaciones : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]]
		});
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

	async refresh ( op : string ) : Promise<void> {
		this.mensajes.mensajeEsperar();
		if ( op == 'Socios' ){
			await this.obtenerSocios();
		} else if ( op == 'Empresas' ) {
			await this.obtenerEmpresas();
		}
		this.mensajes.mensajeGenericoToast('Se actualizó la lista de '+op, 'success');
	}

	private obtenerDetalleSocioEmpresaPorId ( idSocio : number ) : Promise<any> {
		return this.apiSocios.obtenerDetalleSocioEmpresaPorId( idSocio ).toPromise().then(
			respuesta => {
				this.detalleSocioEmpresa = respuesta.data[0];
				this.cargarFormularioModificacion();
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	private cargarFormularioModificacion () : void {
		this.formModEnlaceSocioEmpresa.get('nombreSocio')?.setValue(this.detalleSocioEmpresa.nombreSocio);
		this.formModEnlaceSocioEmpresa.get('nombreEmpresa')?.setValue(this.detalleSocioEmpresa.nombreEmpresa);
		this.formModEnlaceSocioEmpresa.get('mesIngreso')?.setValue(this.detalleSocioEmpresa.mesIngreso);
		this.formModEnlaceSocioEmpresa.get('mesSalida')?.setValue(this.detalleSocioEmpresa.mesSalida);
		this.formModEnlaceSocioEmpresa.get('tipoInstrumento')?.setValue(this.detalleSocioEmpresa.tipoInstrumento);
		this.formModEnlaceSocioEmpresa.get('numeroInstrumento')?.setValue(this.detalleSocioEmpresa.numeroInstrumento);
		this.formModEnlaceSocioEmpresa.get('observaciones')?.setValue(this.detalleSocioEmpresa.observaciones);
	}

	mostrarOpciones ( op : string ) : void {
		const campoNombre : any = this.formModEnlaceSocioEmpresa.get( 'nombre'+op )?.value;
		if ( op == 'Socio' ) {
			this.mostrarOpcionesSocios = campoNombre.length > 0;
			this.statusSocio = this.validaSocioExistente() ?
							   this.opStatusSocio[this.obtenerSocioPorNombre(campoNombre.trim()).status - 1] :
							   '';
		} else if ( op == 'Empresa' ) {
			this.mostrarOpcionesEmpresas = campoNombre.length > 0;
			this.statusEmpresa = this.validaEmpresaExistente() ?
								 this.opStatusEmpresa[this.obtenerEmpresaPorNombre(campoNombre.trim()).status - 1] :
								 '';
		}
		this.formModEnlaceSocioEmpresa.get( 'nombre'+op )?.setValue( campoNombre.trim() );
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

	protected modificarEnlaceSocioEmpresa () : void {
		if ( !this.validaSocioExistente() ) {
			this.mensajes.mensajeGenerico('Para continuar debe colocar un Socio existente y valido.', 'info', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( !this.validaEmpresaExistente() ) {
			this.mensajes.mensajeGenerico('Para continuar debe colocar una Empresa existente y valida.', 'info', 'Los campos requeridos están marcados con un *');
			return;
		}

		if ( this.formModEnlaceSocioEmpresa.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar enlace Socio-Empresa').then(
			respuestaMensaje => {
				if ( respuestaMensaje.isConfirmed ) {
					this.mensajes.mensajeEsperar();
					this.formModEnlaceSocioEmpresa.value.fkSocio = this.obtenerSocioPorNombre(this.formModEnlaceSocioEmpresa.value.nombreSocio).id;
					this.formModEnlaceSocioEmpresa.value.fkEmpresa = this.obtenerEmpresaPorNombre(this.formModEnlaceSocioEmpresa.value.nombreEmpresa).id;

					const dataEnlace = {
						'enlace'   : this.formModEnlaceSocioEmpresa.value,
						'token'    : localStorage.getItem('token'),
						'idEnlace' : this.idDetalle
					};

					this.apiSocios.modificarEnlaceSocioEmpresa(dataEnlace).subscribe(
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

	private validaSocioExistente () : boolean {
		const campoNombre = this.formModEnlaceSocioEmpresa.get('nombreSocio')?.value;
		const registros = this.obtenerSocioPorNombre( campoNombre );
		
		return Object.keys(registros).length != 0 ? true : false;
	}

	private validaEmpresaExistente () : boolean {
		const campoNombre = this.formModEnlaceSocioEmpresa.get('nombreEmpresa')?.value;
		const registros = this.obtenerEmpresaPorNombre( campoNombre );
		
		return Object.keys(registros).length != 0 ? true : false;
	}

	limpiarFormulario() : void {
		this.formModEnlaceSocioEmpresa.reset();
		this.formModEnlaceSocioEmpresa.get('tipoInstrumento')?.setValue('');
	}

	cancelarModificacion() {
		this.limpiarFormulario();
		this.idDetalle = 0;
        this.bsModalRef.hide();
    }

	ngOnDestroy(): void {
		this.limpiarFormulario();
		this.idDetalle = 0;
	}
}