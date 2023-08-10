import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegistroSociosComponent } from '../../modules/socios/registros/registro-socio/registro-socio.component';
import { RegistroEnlaceSociosEmpresasComponent } from 'src/app/logisticaIntegral/home/modules/socios/registros/registro-enlace-socio-empresa/registro-enlace-socio-empresa.component';
import { RegistroPrestamoSocioComponent } from '../../modules/socios/registros/registro-prestamo-socio/registro-prestamo-socio.component';
import Grid from 'src/app/shared/util/funciones-genericas';
import { UsuariosService } from 'src/app/logisticaIntegral/services/usuarios/usuarios.service';

@Component({
  	selector: 'app-sidebar',
  	templateUrl: './sidebar.component.html',
  	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends Grid implements OnInit{
	private countModal : any = 0;
	protected informacionUsuario : any = {};

	constructor (
		private apiUsuarios : UsuariosService,
		private modalService: BsModalService
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		await this.obtenerDatosUsuarios();
	}

	obtenerDatosUsuarios() : void {
		let token = localStorage.getItem('token');
		if(token != undefined){
			this.apiUsuarios.obtenerInformacionUsuarioPorToken(token).subscribe(
				respuesta =>{
					this.informacionUsuario = respuesta[0] ?? {};
				}, error =>{
					this.informacionUsuario = {};
				}
			)
		}
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