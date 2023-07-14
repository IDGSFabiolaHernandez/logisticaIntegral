import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EmpresasService } from 'src/app/logisticaIntegral/services/empresas/empresas.service';
import { IntermediariosService } from 'src/app/logisticaIntegral/services/intermediarios/intermediarios.service';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-registo-empresa',
  	templateUrl: './registo-empresa.component.html',
  	styleUrls: ['./registo-empresa.component.css']
})
export class RegistoEmpresaComponent extends Grid implements OnInit{
	@Input() noQuitClass : boolean = false;

	protected formNuevaEmpresa! : FormGroup;

	constructor (
		private fb : FormBuilder,
		private mensajes : MensajesService,
		private apiEmpresas : EmpresasService,
		private bsModalRef: BsModalRef
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormNuevaEmresa();
	}

	private crearFormNuevaEmresa () : void {
		this.formNuevaEmpresa = this.fb.group({
			nombreEmpresa : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			statusEmpresa : ['', [Validators.required]]
		});
	}

	protected registrarEmpresa () : void {
		if ( this.formNuevaEmpresa.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Registrar Intermediario').then(
			respuestaMensaje => {
				if ( respuestaMensaje.isConfirmed ) {
					this.mensajes.mensajeEsperar();

					const data = {
						empresa : this.formNuevaEmpresa.value,
						token : localStorage.getItem('token')
					};

					this.apiEmpresas.registrarEmpresa(data).subscribe(
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
		this.formNuevaEmpresa.reset();
		this.formNuevaEmpresa.get('statusEmpresa')?.setValue('');
	}

	cancelarRegistro() {
		this.limpiarFormulario();
        this.bsModalRef.hide();
    }
}