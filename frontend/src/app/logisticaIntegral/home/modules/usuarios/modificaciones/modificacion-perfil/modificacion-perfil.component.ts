import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsuariosService } from 'src/app/logisticaIntegral/services/usuarios/usuarios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  selector: 'app-modificacion-perfil',
  templateUrl: './modificacion-perfil.component.html',
  styleUrls: ['./modificacion-perfil.component.css']
})
export class ModificacionPerfilComponent extends Grid implements OnInit, OnDestroy{

	protected formMoficacionPerfil! : FormGroup;
	private inputContrasenia : boolean = false;
  	
	constructor (
		private mensajes : MensajesService,
		private fb : FormBuilder,
		private bsModalRef: BsModalRef,
		private apiUsuarios : UsuariosService
	){
		super();
	}

  	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		this.crearformMoficacionPerfil();
		this.cambioContraseniaPerfil();
		await this.obtenerDetallePerfilPorToken();
  	}

  	private crearformMoficacionPerfil() : void {
		this.formMoficacionPerfil = this.fb.group({
			nombreUsuario 			 : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			correo 		  			 : ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			cambioContraseniaPerfil  : [''],
			contraseniaAntigua 	  	 : [''],
			contraseniaNueva 	  	 : [''],
			confContraseniaNueva 	 : ['']
		})
  	}
	
	private obtenerDetallePerfilPorToken() : Promise<any> {
		return this.apiUsuarios.obtenerInformacionUsuarioPorToken(localStorage.getItem('token')).toPromise().then(
			respuesta =>{
				console.log(respuesta[0]);
				const informacionPerfil = respuesta[0];
				this.cargarFormModificacionPerfil(informacionPerfil);
				this.mensajes.mensajeGenericoToast('Se consultó la información con éxito', 'success');
			},
			error =>{
				this.mensajes.mensajeGenerico('error','error');
			}
		)
	}

	private cargarFormModificacionPerfil(informacionPerfil : any) : void {
		this.formMoficacionPerfil.get('nombreUsuario')?.setValue(informacionPerfil.nombre);
		this.formMoficacionPerfil.get('correo')?.setValue(informacionPerfil.correo);
	}

  	async modificarPerfil() : Promise<any> {
		if(this.formMoficacionPerfil.invalid){
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información personal.', 'warning', 'Los campos requeridos están marcados con un *')
			return;//saca de la funcion
		}

		if(this.inputContrasenia == true){
			this.mensajes.mensajeEsperar();
			const credenciales = {
				contraseniaActual: this.formMoficacionPerfil.get('contraseniaAntigua')?.value,
				token: localStorage.getItem('token')
			}
			await this.apiUsuarios.validarContraseniaActual(credenciales).toPromise().then(
				respuesta =>{
					if(respuesta.status == 204){
						this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
						return;
					}

					this.confirmarModificacion();
				},
				error =>{
					this.mensajes.mensajeGenerico('error','error');
				}
			)
			return;
		}else{
			this.confirmarModificacion();
		}
  	}

	private confirmarModificacion() : void {
		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Modificar Socio').then(
			respuestaMensaje =>{
				if(respuestaMensaje.isConfirmed){
					this.mensajes.mensajeEsperar();
					
					const datosUsuario = {
						 perfilInformacion: this.formMoficacionPerfil.value,
						 token: localStorage.getItem('token')
					}
					this.apiUsuarios.modificarUsuario(datosUsuario).subscribe(
						respuesta => {
							if(respuesta.status == 409){
								this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
								return;
							}

							this.mensajes.mensajeGenerico(respuesta.mensaje, 'success');
							return;
						},

						error => {
							this.mensajes.mensajeGenerico('error', 'error');
						}
					);
				}
			}
		)
	}

  	cancelarModificacion() : void {
		this.bsModalRef.hide();
  	}

	cambioContraseniaPerfil() : void {
		this.inputContrasenia = this.formMoficacionPerfil.get('cambioContraseniaPerfil')?.value;
		if(this.inputContrasenia == false){
		  	this.formMoficacionPerfil.controls['contraseniaAntigua']?.disable();
		  	this.formMoficacionPerfil.controls['contraseniaNueva']?.disable();
		  	this.formMoficacionPerfil.controls['confContraseniaNueva']?.disable();
		  	this.formMoficacionPerfil.get('contraseniaAntigua')?.setValue(null);
		  	this.formMoficacionPerfil.get('contraseniaNueva')?.setValue(null);
		  	this.formMoficacionPerfil.get('confContraseniaNueva')?.setValue(null);
			this.formMoficacionPerfil.get('contraseniaAntigua')?.clearValidators();
			this.formMoficacionPerfil.get('contraseniaAntigua')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('contraseniaNueva')?.clearValidators();
			this.formMoficacionPerfil.get('contraseniaNueva')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('confContraseniaNueva')?.clearValidators();
			this.formMoficacionPerfil.get('confContraseniaNueva')?.updateValueAndValidity();
		} else {
		  	this.formMoficacionPerfil.controls['contraseniaNueva']?.enable();
		  	this.formMoficacionPerfil.controls['contraseniaAntigua']?.enable();
		  	this.formMoficacionPerfil.controls['confContraseniaNueva']?.enable();
			this.formMoficacionPerfil.get('contraseniaAntigua')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]);
			this.formMoficacionPerfil.get('contraseniaAntigua')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('contraseniaNueva')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]);
			this.formMoficacionPerfil.get('contraseniaNueva')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('confContraseniaNueva')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]);
			this.formMoficacionPerfil.get('confContraseniaNueva')?.updateValueAndValidity();
		}
	}

  	ngOnDestroy(): void {
		this.cancelarModificacion();
  	}
}
