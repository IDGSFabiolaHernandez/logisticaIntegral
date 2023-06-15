import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModificacionSocioComponent } from '../../modules/socios/modificaciones/modificacion-socio/modificacion-socio.component';
import { DetalleEnlaceSocioEmpresasComponent } from '../../modules/socios/detalles/detalle-enlace-socio-empresas/detalle-enlace-socio-empresas.component';

@Component({
  	selector: 'app-datatable',
  	templateUrl: './datatable.component.html',
  	styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, OnChanges {
	@Input() columnasTabla : any = [];
	@Input() datosTabla : any = [];
	@Input() tableConfig : any = [];
	@Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

	protected selectedCheckboxes: any[] = [];

  	public currentPage : number = 1;
	public itemsPerPageOptions = [5, 10, 25, 50];
	public itemsPerPage = this.itemsPerPageOptions[0];

	public sortBy: string = '';
  	public sortDesc: boolean = false;

	public filterValues : { [key: string]: string } = {};

	constructor (
		private modalService: BsModalService
	) {}

	ngOnInit(): void {
		this.selectedCheckboxes = [];
		this.emitirDatos();
		Object.keys(this.columnasTabla).forEach((key) => {
			this.filterValues[key] = '';
		});
	}

	ngOnChanges(): void {
		this.selectedCheckboxes = [];
		this.emitirDatos();
		this.onItemsPerPageChange();
	}

	abrirModalModificacion(idDetalle: number, idModal: string) {
		const data = {
		  idDetalle: idDetalle
		};
	  
		const configModalModificacion: any = {
			backdrop: false,
			ignoreBackdropClick: true,
			keyboard: false,
			animated: true,
			class: 'modal-xl modal-dialog-centered modal-dialog-scrollable custom-modal',
			initialState: data,
			style: {
				'background-color': 'transparent',
				'overflow-y': 'auto'
			}
		};
	  
		switch (idModal) {
		  	case 'modificacionSocio':
				const modalRef: BsModalRef = this.modalService.show(ModificacionSocioComponent, configModalModificacion);
			break;
		}
	}

	abrirModalDetalle(idDetalle: number, idModal: string) {
		const data = {
		  idDetalle: idDetalle
		};
	  
		const configModalDetalle: any = {
		  backdrop: false,
		  ignoreBackdropClick: true,
		  keyboard: false,
		  animated: true,
		  class: 'modal-dialog-centered custom-modal custom-width',
		  initialState: data
		};
	  
		switch (idModal) {
		  case 'detalleEnlaceSocioEmpresas':
			const modalRef: BsModalRef = this.modalService.show(DetalleEnlaceSocioEmpresasComponent, configModalDetalle);
			break;
		}
	}

	get paginatedItems() {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
	  
		return this.datosTabla.filter((registro : any) => {
			return Object.keys(this.filterValues).every((column : any) => {
				const filter = this.filterValues[column].toLowerCase();
				return (registro[column]?.toString()?.toLowerCase() ?? '').includes(filter);
			});
		}).slice(startIndex, endIndex);
	}
	
	get totalPages() {
		return Math.ceil(this.datosTabla.length / this.itemsPerPage);
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

	sortColumn(indice: string) {
		if (this.sortBy === indice) {
		  this.sortDesc = !this.sortDesc;
		} else {
		  this.sortBy = indice;
		  this.sortDesc = false;
		}
		
		this.datosTabla.sort((a : any, b : any) => {
			const valueA = a[indice];
			const valueB = b[indice];
		
			if (valueA < valueB) {
				return this.sortDesc ? 1 : -1;
			} else if (valueA > valueB) {
				return this.sortDesc ? -1 : 1;
			} else {
				return 0;
			}
		});
	}

	getColumnKeys(): string[] {
		return Object.keys(this.columnasTabla);
	}

	getStartIndex(): number {
		return (this.currentPage - 1) * this.itemsPerPage + 1;
	}
	
	getEndIndex(): number {
		const endIndex = this.currentPage * this.itemsPerPage;
		return Math.min(endIndex, this.datosTabla.length);
	}

	isCheckboxSelected(id: number): boolean {
		return this.selectedCheckboxes.includes(id);
	}

	toggleCheckboxSelection(event: any, id: number): void {
		if (event.target.checked) {
		  	this.selectedCheckboxes.push(id);
		} else {
		  	const index = this.selectedCheckboxes.indexOf(id);
		  	if (index !== -1) {
				this.selectedCheckboxes.splice(index, 1);
		  	}
		}

		this.emitirDatos();
	}

	emitirDatos () : void {
		const data = {
			selectedOptions : this.selectedCheckboxes
		};
		this.selectionChange.emit(data);
	}
}