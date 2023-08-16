import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Grid from 'src/app/shared/util/funciones-genericas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro-nombre-entrga-recibo-pago',
  templateUrl: './registro-nombre-entrga-recibo-pago.component.html',
  styleUrls: ['./registro-nombre-entrga-recibo-pago.component.css']
})
export class RegistroNombreEntrgaReciboPagoComponent extends Grid implements OnInit{
  	@Input() idDetalle : any = 0;
	
	protected formCapturaNombre! : FormGroup;

	private url = environment.api;

	constructor (
		private fb : FormBuilder,
		private mensajes : MensajesService,
		private bsModalRef: BsModalRef
	) {
		super();
	}

	ngOnInit(): void {
		this.crearFormCapturaNombre();
	}

	private crearFormCapturaNombre () : void {
		this.formCapturaNombre = this.fb.group({
			nombreEntregaReciboPago : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú]*')]],
		});
	}

	protected capturarNombreParaPDF () : void {
		if ( this.formCapturaNombre.invalid ) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta.', 'warning', 'Los campos requeridos están marcados con un *');
			return;
		}

		const rutaPdf = 'generarPdfPagoMensualidad';

		this.mensajes.mensajeConfirmacionCustom('Favor de asegurarse que los datos sean correctos', 'question', 'Generar PDF').then(
			respuestaMensaje => {
				if ( respuestaMensaje.isConfirmed ) {
					this.mensajes.mensajeEsperar();
					window.open(this.url+'/'+rutaPdf+'/'+this.idDetalle+'/'+this.formCapturaNombre.value.nombreEntregaReciboPago);
					this.cancelarRegistro();
					this.mensajes.mensajeGenerico('Se generó el PDF con éxito', 'success');
				}
			}
		);
	}

	private limpiarFormulario () : void {
		this.formCapturaNombre.reset();
	}

	cancelarRegistro() {
		this.limpiarFormulario();
        this.bsModalRef.hide();
    }
}