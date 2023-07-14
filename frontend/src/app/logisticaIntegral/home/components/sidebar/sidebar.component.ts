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
	private countModal : any = 0;

	constructor (
		private modalService: BsModalService
	) {
		super();
	}

	protected abrirModalRegistro ( idModal : string ) : void {
		this.countModal += 1;

		this.countModal = '-side'+this.countModal;
		
		const configModalRegistro: any = {
			backdrop: false,
			ignoreBackdropClick: true,
			keyboard: false,
			initialState : {
				idModal : this.countModal
			},
			animated: true,
			class: 'modal-xl modal-dialog-centered custom-modal modal-registro'+this.countModal,
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
			const modalBodyElement = document.querySelector('.modal-registro' + this.countModal + ' .modal-body');
			const modalFooterElement = document.querySelector('.modal-registro' + this.countModal + ' .modal-footer');
		
			if (modalBodyElement && modalFooterElement) {
				modalBodyElement.addEventListener('mousedown', this.onMouseDown.bind(this) as EventListener);
				modalFooterElement.addEventListener('mousedown', this.startResizing.bind(this) as EventListener);
			}
		
			document.body.classList.remove('modal-open');
			document.body.style.paddingRight = '';
			document.body.style.overflow = '';
		}, 100);
	}
}