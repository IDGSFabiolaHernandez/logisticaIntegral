import { Component } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import Option from 'src/app/shared/interfaces/options.interface';

@Component({
  	selector: 'app-lista-socios',
  	templateUrl: './lista-socios.component.html',
  	styleUrls: ['./lista-socios.component.css']
})
export class ListaSociosComponent {
	protected opcionesSocios : Option[] = [];
	private sociosSeleccionados : any[] = [];
	protected listaSocios : any[] = [];

	public currentPage : number = 1;
	public itemsPerPageOptions = [5, 10, 25, 50];
	public itemsPerPage = this.itemsPerPageOptions[0];

	sortBy: string = '';
  	sortDesc: boolean = false;

	filterValues : any = {
		id: '',
		nombreSocio: '',
		status: '',
		numEmpresas: '',
		curpSocio: '',
		rfcSocio: '',
		nombreIntermediario: ''
	};	  

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
	  
		return this.listaSocios.filter((socio) => {
			return Object.keys(this.filterValues).every((column) => {
				const filter = this.filterValues[column].toLowerCase();
				return socio[column].toString().toLowerCase().includes(filter);
			});
		}).slice(startIndex, endIndex);
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

	sortColumn(column: string) {
		if (this.sortBy === column) {
		  	this.sortDesc = !this.sortDesc;
		} else {
			this.sortBy = column;
			this.sortDesc = false;
		}
	
		this.listaSocios.sort((a, b) => {
			const valueA = a[column];
			const valueB = b[column];
		
			if (valueA < valueB) {
				return this.sortDesc ? 1 : -1;
			} else if (valueA > valueB) {
				return this.sortDesc ? -1 : 1;
			} else {
				return 0;
			}
		});
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