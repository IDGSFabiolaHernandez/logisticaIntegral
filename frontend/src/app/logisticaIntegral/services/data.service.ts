import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataService {
  	public claseSidebar : string = '';

  	public realizarClickConsultarSocios: EventEmitter<void> = new EventEmitter<void>();
  	public realizarClickConsultarSociosEmpresas: EventEmitter<void> = new EventEmitter<void>();
}