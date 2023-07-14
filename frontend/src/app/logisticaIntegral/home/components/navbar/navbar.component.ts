import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/logisticaIntegral/services/data.service';
import { MensajesService } from '../../../../services/mensajes/mensajes.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/service/login.service';
import { UsuariosService } from 'src/app/logisticaIntegral/services/usuarios/usuarios.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModificacionPerfilComponent } from '../../modules/usuarios/modificaciones/modificacion-perfil/modificacion-perfil.component';
import Grid from 'src/app/shared/util/funciones-genericas';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent extends Grid implements OnInit{
  protected informacionUsuario : any = [];
  private countModal : number = 0;

  constructor(
    private dataService : DataService,
    private mensajes : MensajesService,
    private router : Router,
    private apiLogin : LoginService,
    private apiUsuarios : UsuariosService,
    private modalService : BsModalService
  ){
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
          this.informacionUsuario = respuesta;
        }, error =>{
          localStorage.removeItem('token');
          localStorage.clear();
          this.router.navigate(['/']);
          this.mensajes.mensajeGenerico('Al parecer su sesión expiró, necesita volver a iniciar sesión', 'error');
        }
      )
    }
  }

  logout() : void {
    this.mensajes.mensajeEsperar();
    let token = localStorage.getItem('token');
    this.apiLogin.logout(token).subscribe(
      respuesta =>{
        localStorage.removeItem('token');
        localStorage.clear();
        this.router.navigate(['/']);
        this.mensajes.mensajeGenerico(respuesta.mensaje, 'info');
      },
    
      error =>{
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

  prueba() : void {
    this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
  }

  abrirModalModificacionPerfil() : void {
    this.countModal += 1;
    
    const configModalMoficiacion : any = {
      backdrop: false,
      ignoreBackdropClick: true,
      keyboard: false,
      animated: true,
      class: 'modal-lg modal-dialog-centered custom-modal modal-modificacion modal-profile'+this.countModal,
      style: {
        'background-color': 'transparent',
        'overflow-y': 'auto'
      }
    }

    const modal : BsModalRef = this.modalService.show(ModificacionPerfilComponent, configModalMoficiacion)

    setTimeout(() => {
			const modalBodyElement = document.querySelector('.modal-profile' + this.countModal + ' .modal-body');
			const modalFooterElement = document.querySelector('.modal-profile' + this.countModal + ' .modal-footer');
		
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