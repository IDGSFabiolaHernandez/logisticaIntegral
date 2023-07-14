import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegistroSociosComponent } from '../../modules/socios/registros/registro-socio/registro-socio.component';
import { RegistroEnlaceSociosEmpresasComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-enlace-socio-empresa/registro-enlace-socio-empresa.component';
import { RegistroPrestamoSocioComponent } from '../../modules/socios/registros/registro-prestamo-socio/registro-prestamo-socio.component';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  	selector: 'app-sidebar',
  	templateUrl: './sidebar.component.html',
  	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends Grid{
	constructor (
		private modalService: BsModalService
	) {
		super();
	}

	protected abrirModalRegistro ( idModal : string ) : void {
		const configModalRegistro: any = {
			backdrop: false,
			ignoreBackdropClick: true,
			keyboard: false,
			animated: true,
			class: 'modal-xl modal-dialog-centered custom-modal modal-registro',
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

		setTimeout(() => {
			const modalContentElement = document.querySelector('.modal-registro');
			if (modalContentElement) {
				const modalElement = modalContentElement.parentElement;
				modalElement?.addEventListener('mousedown', this.onMouseDown.bind(this) as EventListener);
			}
			  
			document.body.classList.remove('modal-open');
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
		}, 100);
	}
}