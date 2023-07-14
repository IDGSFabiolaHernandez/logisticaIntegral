import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IntermediariosService } from 'src/app/logisticaIntegral/services/intermediarios/intermediarios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-registro-intermediario-socios',
  	templateUrl: './registro-intermediario-socios.component.html',
  	styleUrls: ['./registro-intermediario-socios.component.css']
})
export class RegistroIntermediarioSociosComponent extends Grid implements OnInit{
	@Input() noQuitClass : boolean = false;

	protected formNuevoIntermediario! : FormGroup;

	constructor (
		private fb : FormBuilder,
		private mensajes : MensajesService,
		private apiIntermediarios : IntermediariosService,
		private bsModalRef: BsModalRef
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormNuevoIntermediario();
	}

	private crearFormNuevoIntermediario () : void {
		this.formNuevoIntermediario = this.fb.group({
			nombreIntermediario : ['', [Validators.required]]
		});
	}

	protected registrarIntermediario () : void {
		if ( this.formNuevoIntermediario.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'warning', 'Los campos requeridos están marcados con un *');
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Registrar Intermediario').then(
			respuestaMensaje => {
				if ( respuestaMensaje.isConfirmed ) {
					this.mensajes.mensajeEsperar();

					const data = {
						intermediario : this.formNuevoIntermediario.value,
						token : localStorage.getItem('token')
					};

					this.apiIntermediarios.registrarIntermediario(data).subscribe(
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

	private limpiarFormulario () : void {
		this.formNuevoIntermediario.reset();
	}

	cancelarRegistro() {
		this.limpiarFormulario();
        this.bsModalRef.hide();
    }
}