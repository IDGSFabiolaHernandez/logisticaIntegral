import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegistroSociosComponent } from '../../modules/socios/registros/registro-socio/registro-socio.component';
import { RegistroEnlaceSociosEmpresasComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-enlace-socio-empresa/registro-enlace-socio-empresa.component';
import { RegistroPrestamoSocioComponent } from '../../modules/socios/registros/registro-prestamo-socio/registro-prestamo-socio.component';

@Component({
  	selector: 'app-sidebar',
  	templateUrl: './sidebar.component.html',
  	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
	constructor (
		private modalService: BsModalService
	) {

	}

	protected abrirModalRegistro ( idModal : string ) : void {
		const configModalRegistro: any = {
			backdrop: false,
			ignoreBackdropClick: true,
			keyboard: false,
			animated: true,
			class: 'modal-xl modal-dialog-centered custom-modal',
			style: {
				'background-color': 'transparent',
				'overflow-y': 'auto'
			}
		};

		let op : any = undefined;
		switch (idModal) {
		  	case 'registroSocio':
				op = this.modalService.show(RegistroSociosComponent, configModalRegistro);
			break;
			case 'registroEnlaceSocioEmpresa':
				op = this.modalService.show(RegistroEnlaceSociosEmpresasComponent, configModalRegistro);
			break;
			case 'registroPrestamoSocio':
				op = this.modalService.show(RegistroPrestamoSocioComponent, configModalRegistro);
			break;
		}

		const modalRef: BsModalRef = op;
	}
}