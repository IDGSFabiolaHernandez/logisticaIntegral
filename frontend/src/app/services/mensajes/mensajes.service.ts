import { Injectable, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  
  private mensajeError500 : string = 'Al parecer ocurrió un error interno, por favor contactarse con el DTIC de GALA';
  
  mensajeEsperar(): void {
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere un momento...',
      icon: 'info',
      confirmButtonText: 'Cool',
      keyboard: false,
      allowEscapeKey: false
    } as any);
    Swal.showLoading();
  }


  cerrarMensajes():void{
    Swal.close()
  }

  mensajeGenerico( mensaje: string, tipo: string, title: string = '', html = null ) : void {
    mensaje = mensaje == 'error' ? this.mensajeError500 : mensaje;
    let data: any = {
      title,
      allowOutsideClick: false,
      icon: tipo,
      text: mensaje,
      confirmButtonText: 'Continuar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      keyboard: false,
      allowEscapeKey: false
    };
    if (html){
      data['html'] = html;
    }
    Swal.fire(data);
  }

  mensajeGenericoToast( mensaje : string, tipo: string, tiempo: number = 3000 ){
    let Toast: any = Swal.mixin({
      toast : true,
      position : 'bottom-end',
      showConfirmButton : false,
      timer : tiempo,
      timerProgressBar : true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: tipo,
      title: mensaje
    });
  }

  mensajeConfirmacionCustom(mensaje: string, tipo: any, titulo: string = '', btnConfirmar = 'Continuar', btnCancelar = 'Cancelar', btnDenegado = 'Denegar', showDeny = false) {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: tipo,
      showDenyButton: showDeny,
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      denyButtonColor: '#6e7d88',
      confirmButtonText: btnConfirmar,
      cancelButtonText: btnCancelar,
      denyButtonText: btnDenegado,
      customClass: {
        cancelButton: 'order-2',
        denyButton: 'order-3',
        confirmButton: 'order-1 btn btn-primary'
      },
      allowEscapeKey: false
    });
  }
}