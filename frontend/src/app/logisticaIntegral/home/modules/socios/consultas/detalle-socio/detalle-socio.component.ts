import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { SociosService } from '../../../../../services/socios/socios.service';
import { ExcelService } from 'src/app/shared/util/excel.service';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
	selector: 'app-detalle-socio',
	templateUrl: './detalle-socio.component.html',
	styleUrls: ['./detalle-socio.component.css']
})
export class DetalleSocioComponent extends Grid implements OnInit{
	@Input() idDetalle: number = 0;

	protected columnasDetalleSocio : any = {
		'dato' 	: 'Dato',
		'valor' : 'Valor'
	};
	protected detalleSocio : any[] = [];
	
	constructor (
		private bsModalRef : BsModalRef,
		private mensajes : MensajesService,
		private apiSocios : SociosService,
		private excelService : ExcelService
	) {
		super();
	}

	async ngOnInit() : Promise<any> {
		this.mensajes.mensajeEsperar();
		await this.obtenerDetalleSocioEspecial(this.idDetalle);
	}

	private obtenerDetalleSocioEspecial ( idSocio : number ) : Promise<any> {
		return this.apiSocios.obtenerDetalleSocioEspecial( idSocio ).toPromise().then(
			respuesta => {
				this.detalleSocio = respuesta.data;
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected exportarExcel () : void {
		this.mensajes.mensajeEsperar();

		const nombreExcel = 'Detalle de Socio '+this.detalleSocio[0].valor+': ' + this.getNowString();

		this.excelService.exportarExcel(
			this.detalleSocio,
			this.columnasDetalleSocio,
			nombreExcel
		);
	}

	public cerrarModal() : void {
		this.bsModalRef.hide();
	}
}