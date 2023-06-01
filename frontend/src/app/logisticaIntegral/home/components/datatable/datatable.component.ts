import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  	selector: 'app-datatable',
  	templateUrl: './datatable.component.html',
  	styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, OnChanges {
	@Input() columnasTabla : any = [];
	@Input() datosTabla : any = [];

  	public currentPage : number = 1;
	public itemsPerPageOptions = [5, 10, 25, 50];
	public itemsPerPage = this.itemsPerPageOptions[0];

	public sortBy: string = '';
  	public sortDesc: boolean = false;

	public filterValues : { [key: string]: string } = {};

	constructor () {}

	ngOnInit(): void {
		Object.keys(this.columnasTabla).forEach((key) => {
			this.filterValues[key] = '';
		});
	}

	ngOnChanges(): void {
		this.onItemsPerPageChange();
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
}
