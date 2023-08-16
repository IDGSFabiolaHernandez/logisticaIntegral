import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModificacionSocioComponent } from '../../modules/socios/modificaciones/modificacion-socio/modificacion-socio.component';
import { DetalleEnlaceSocioEmpresasComponent } from '../../modules/socios/detalles/detalle-enlace-socio-empresas/detalle-enlace-socio-empresas.component';
import { ModificacionEnlaceSocioEmpresaComponent } from '../../modules/socios/modificaciones/modificacion-enlace-socio-empresa/modificacion-enlace-socio-empresa.component';
import { DetalleAbonosPrestamoComponent } from '../../modules/socios/detalles/detalle-abonos-prestamo/detalle-abonos-prestamo.component';
import Grid from 'src/app/shared/util/funciones-genericas';
import { environment } from 'src/environments/environment';
import { RegistroNombreEntrgaReciboPagoComponent } from '../../modules/socios/registros/registro-nombre-entrga-recibo-pago/registro-nombre-entrga-recibo-pago.component';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';

@Component({
  	selector: 'app-datatable',
  	templateUrl: './datatable.component.html',
  	styleUrls: ['./datatable.component.css']
})
export class DatatableComponent extends Grid implements OnInit, OnChanges {
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

	private url = environment.api;

	constructor (
		private modalService : BsModalService,
		private mensajes : MensajesService
	) {
		super();
	}

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
			class: 'modal-xl modal-dialog-centered custom-modal move-modal' + idDetalle,
			initialState: data,
			style: {
				'background-color': 'transparent',
				'overflow-y': 'auto'
			}
		};
	  
		let op: any = undefined;
	  
		switch (idModal) {
			case 'modificacionSocio':
				op = this.modalService.show(ModificacionSocioComponent, configModalModificacion);
			break;
			case 'modificacionEnlaceSocioEmpresa':
				op = this.modalService.show(ModificacionEnlaceSocioEmpresaComponent, configModalModificacion);
			break;
			case 'capturaNombreEntregaReciboPago':
				op = this.modalService.show(RegistroNombreEntrgaReciboPagoComponent, configModalModificacion);
			break;
		}
	  
		setTimeout(() => {
			const modalBodyElement = document.querySelector('.move-modal' + idDetalle + ' .modal-body');
			const modalFooterElement = document.querySelector('.move-modal' + idDetalle + ' .modal-footer');
		
			if (modalBodyElement && modalFooterElement) {
				modalBodyElement.addEventListener('mousedown', this.onMouseDown.bind(this) as EventListener);
				modalFooterElement.addEventListener('mousedown', this.startResizing.bind(this) as EventListener);
			}
		
			document.body.classList.remove('modal-open');
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
		}, 100);
	}
	
	abrirModalDetalle(idDetalle: number, idModal: string) {
		const data = {
		  	idDetalle: idDetalle
		};

		idDetalle = idModal == 'detalleEnlaceSocioEmpresasPrestamo' ? 1+idDetalle : idDetalle;

		let configModalDetalle: any = {
		  	backdrop: false,
		  	ignoreBackdropClick: true,
		  	keyboard: false,
		  	animated: true,
		  	class: 'modal-xl modal-dialog-centered custom-modal move-modal-detail'+(idDetalle),
		  	initialState: data
		};

		let op : any = undefined;
	  
		switch (idModal) {
		  	case 'detalleEnlaceSocioEmpresas':
				op = this.modalService.show(DetalleEnlaceSocioEmpresasComponent, configModalDetalle);
			break;
			case 'detalleEnlaceSocioEmpresasPrestamo':
				configModalDetalle.initialState.datosPrestamo = true;
				op = this.modalService.show(DetalleEnlaceSocioEmpresasComponent, configModalDetalle);
			break;
			case 'detalleAbonosPrestamoSocio':
				op = this.modalService.show(DetalleAbonosPrestamoComponent, configModalDetalle);
			break;
		}

		setTimeout(() => {
			const modalBodyElement = document.querySelector('.move-modal-detail' + idDetalle + ' .modal-body');
			const modalFooterElement = document.querySelector('.move-modal-detail' + idDetalle + ' .modal-footer');
		
			if (modalBodyElement && modalFooterElement) {
				modalBodyElement.addEventListener('mousedown', this.onMouseDown.bind(this) as EventListener);
				modalFooterElement.addEventListener('mousedown', this.startResizing.bind(this) as EventListener);
			}
		
			document.body.classList.remove('modal-open');
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
		}, 100);
	}

	descargarPdf ( idDetalle: number, rutaPdf: string ) {
		this.mensajes.mensajeEsperar();
		window.open(this.url+'/'+rutaPdf+'/'+idDetalle);
		this.mensajes.mensajeGenerico('Se generó el PDF con éxito', 'success');
	}

	get paginatedItems() {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
	  
		return this.datosTabla.filter((registro: any) => {
			return Object.keys(this.filterValues).every((column: any) => {
				const filter = this.filterValues[column].toLowerCase();
				const value = registro[column]?.toString()?.toLowerCase();
		
				if (filter === '') {
					return true;
				} else if (filter === 'null' && this.tableConfig[column]?.showEmptyOption) {
					return value === undefined || value === null || value === '';
				} else {
					return value?.includes(filter);
				}
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

	getTableColumnStyle(columna: string, rowData: any): any {
		const columnConfig = this.tableConfig[columna];
	  
		if (columnConfig && columnConfig.style) {
		  	const cantidad = rowData[columna];
	  
		  	if (cantidad != null && cantidad > 0) {
				return columnConfig.style;
		  	}
		}
	  
		return null;
	}

	emitirDatos () : void {
		const data = {
			selectedOptions : this.selectedCheckboxes
		};
		this.selectionChange.emit(data);
	}
}