import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import Option from 'src/app/shared/interfaces/options.interface';

@Component({
  	selector: 'app-dropdown',
  	templateUrl: './dropdown.component.html',
  	styleUrls: ['./dropdown.component.css']
})

export class DropdownComponent implements OnInit, OnChanges {
	@Input() options: Option[] = [];
  	@Input() font: string = '';
	@Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

	selectedCount = 0;
	filteredOptions: Option[] = [];
	searchText : string = '';

	constructor(private elementRef: ElementRef) {}

	ngOnInit(): void {
		this.filteredOptions = [...this.options];
		this.updateSelectedCount();
	}

	ngOnChanges(): void {
		this.updateSelectedCount();
	}

	closeDropdown(event: MouseEvent) {
		const dropdownMenu = this.elementRef.nativeElement.querySelector('.dropdown-menu');
		if (dropdownMenu && !dropdownMenu.contains(event.target as Node)) {
		this.filteredOptions = [...this.options];
		}
	}

	selectAllChanged(event: any) {
		const checked = event.target.checked;
		this.options.forEach(option => (option.checked = checked));
		this.filteredOptions = [...this.options];
		this.updateSelectedCount();
	}

	optionChanged(option: Option) {
		option.checked = !option.checked;
		this.filteredOptions = [...this.options];
		this.updateSelectedCount();
	}

	filterOptions(event: Event) {
		const searchText = (event.target as HTMLInputElement).value;
		this.searchText = searchText;
		if (searchText === '') {
			this.filteredOptions = [...this.options];
		} else {
			this.filteredOptions = this.options.filter(option => option.label.toLowerCase().includes(searchText.toLowerCase()));
		}
		this.updateSelectedCount();
	}

	alternativeFilter () {
		const searchText = this.searchText;
		if (searchText === '') {
			this.filteredOptions = [...this.options];
		} else {
			this.filteredOptions = this.options.filter(option => option.label.toLowerCase().includes(searchText.toLowerCase()));
		}
	}

	allOptionsSelected(): boolean {
		return this.options.every(option => option.checked);
	}

	updateSelectedCount() {
		this.selectedCount = this.getSelectedOptions().length;
		this.updateSelection();
	}

	getSelectedOptions(): Option[] {
		return this.options.filter(option => option.checked);
	}

	updateSelection() {
		const data = {
			selectedOptions : this.getSelectedOptions(),
			from : this.font
		};
		this.selectionChange.emit(data);
		this.alternativeFilter();
	}
}