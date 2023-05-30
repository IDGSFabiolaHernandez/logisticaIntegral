import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Option from '../../../../shared/interfaces/options.interface';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { Subject } from 'rxjs';

interface Socio {
	id: number;
	nombreSocio: string;
	status: string;
	numEmpresas: number;
	curpSocio: string;
	rfcSocio: string;
	nombreIntermediario: string;
  }

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})

export class SociosComponent implements OnInit {
	protected opcionesSocios : Option[] = [];
	private sociosSeleccionados : any[] = [];
	protected listaSocios : any[] = [];

	public currentPage : number = 1;
	public itemsPerPageOptions = [5, 10, 25, 50];
	public itemsPerPage = this.itemsPerPageOptions[0];

	constructor (
		private mensajes : MensajesService,
		private apiSocios : SociosService
	) {}

	async ngOnInit () : Promise<void> {
		this.mensajes.mensajeEsperar();
		await this.obtenerSociosSelect();
		this.mensajes.cerrarMensajes();
	}

	private obtenerSociosSelect () : Promise<any> {
		return this.apiSocios.obtenerSociosSelect().toPromise().then(
			respuesta => {
				this.opcionesSocios = respuesta.data;
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	onSelectionChange(selectedOptions: Option[]) {
		this.sociosSeleccionados = selectedOptions;
	}

	get paginatedItems() {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		return this.listaSocios.slice(startIndex, endIndex);
	}
	
	get totalPages() {
		return Math.ceil(this.listaSocios.length / this.itemsPerPage);
	}
	
	get pagesArray() {
		const visiblePages = 3;
		const halfVisible = Math.floor(visiblePages / 2);
	
		let startPage = Math.max(this.currentPage - halfVisible, 1);
		let endPage = startPage + visiblePages - 1;
	
		if (endPage > this.totalPages) {
			endPage = this.totalPages;
			startPage = Math.max(endPage - visiblePages + 1, 1);
		}
	
		return Array(endPage - startPage + 1).fill(0).map((_, i) => startPage + i);
	}
	
	goToPage(page: number) {
		if (page >= 1 && page <= this.totalPages) {
			this.currentPage = page;
		}
	}
	
	onItemsPerPageChange() {
		this.currentPage = 1;
		this.itemsPerPage = Number(this.itemsPerPage);
	}

	consultarSociosPorSelect () : void {
		this.mensajes.mensajeEsperar();

		if ( this.sociosSeleccionados.length == 0 ) {
			this.mensajes.mensajeGenerico('Para continuar antes debe seleccionar al menos un Socio', 'info');
			return;
		}

		const arregloSocios = { socios : this.sociosSeleccionados.map(({value}) => value) };

		this.apiSocios.obtenerListaSocios(arregloSocios).subscribe(
			respuesta => {
				this.listaSocios = respuesta.data;
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}
}