import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { ExcelService } from 'src/app/shared/util/excel.service';
import Grid from 'src/app/shared/util/funciones-genericas';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PrestamosService } from '../../../../../services/prestamos/prestamos.service';

@Component({
  selector: 'app-detalle-abonos-prestamo',
  templateUrl: './detalle-abonos-prestamo.component.html',
  styleUrls: ['./detalle-abonos-prestamo.component.css']
})
export class DetalleAbonosPrestamoComponent extends Grid implements OnInit, OnDestroy{
    @Input() idDetalle: number = 0;

	protected columnasAbonosPrestamo : any = {
		folio         : 'Folio',
		nombreEmpresa : 'Empresa',
		mensualidad   : 'Mensualidad Pagada',
		cantidad      : 'Cantidad Pagada',
		abonoPrestamo : 'Abono a Préstamo',
		fechaPago     : 'Fecha de Pago'
	};

	protected tableConfig : any = {
		"cantidad" : {
			"moneyColumn" : true
		},
		"abonoPrestamo" : {
			"moneyColumn" : true,
			"style" : {
				"color" : "red",
				"font-weight" : "bold"
			}
		}
	}
	protected listaAbonosPrestamo : any[] = [];
	protected detallePrestamo : any = {};

	constructor (
		private mensajes : MensajesService,
		private excelService : ExcelService,
		private bsModalRef : BsModalRef,
		private prestamosService : PrestamosService
	){
		super();
	}

	async ngOnInit(): Promise<void> {
		this.mensajes.mensajeEsperar();
		await Promise.all([
			this.obtenerAbonosPrestamo()
		]);
	}

	private obtenerAbonosPrestamo() : Promise<any> {
		return this.prestamosService.obtenerAbonosPrestamo(this.idDetalle).toPromise().then(
			respuesta => {
				this.listaAbonosPrestamo = respuesta.data.abonosPrestamo;
				
				this.detallePrestamo.montoPrestamo = '$ ' + respuesta.data.detallePrestamo[0].montoPrestamo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
				this.detallePrestamo.aCuenta = '$ ' + respuesta.data.detallePrestamo[0].aCuenta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
				this.detallePrestamo.saldo = '$ ' + respuesta.data.detallePrestamo[0].saldo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
				
				console.log(this.detallePrestamo);
				if(this.listaAbonosPrestamo.length == 0) {
					this.mensajes.mensajeGenericoToast('No hay información para mostrar', 'warning');
					this.cancelarModal();
					return;
				}
				this.mensajes.mensajeGenericoToast(respuesta.mensaje,'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	protected exportarExcel () : void {
		this.mensajes.mensajeEsperar();

		const nombreExcel = 'Detalle Abonos Préstamo: ' + this.getNowString();

		this.excelService.exportarExcel(
			this.listaAbonosPrestamo,
			this.columnasAbonosPrestamo,
			nombreExcel
		);
	}
	
	protected canExport () : boolean {
		return this.listaAbonosPrestamo.length != 0;
	}

	protected cancelarModal() : any {
		this.bsModalRef.hide();
		this.idDetalle = 0;
		this.listaAbonosPrestamo = [];
	}

	ngOnDestroy(): void {
		this.idDetalle = 0;
		this.listaAbonosPrestamo = [];
	}
}
