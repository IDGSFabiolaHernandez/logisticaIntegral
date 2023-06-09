import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public formLogin! : FormGroup;
  public hide : boolean = true;

  constructor(
    private fb : FormBuilder,
    private mensajes : MensajesService,
    private apiLogin : LoginService,
    private router : Router
  ){ 
  }

  ngOnInit () : void{
    this.crearFormLogin();

    let token = localStorage.getItem('token');
    if(token != undefined){
      this.mensajes.mensajeEsperar();
      this.apiLogin.auth(token).toPromise().then(
        status => {
          if(status){
            this.router.navigate(['/logistica/inicio']);
            this.mensajes.mensajeGenerico('Al parecer ya tienes una sesión activa, si desea ingresar con otra cuenta, necesita antes cerrar la sesión actual', 'info');
          } else {
            this.mensajes.cerrarMensajes();
          }
        }, error => {
          this.mensajes.mensajeGenerico('error', 'error');
        }
      )
    }
  }

  crearFormLogin () : void {
    this.formLogin = this.fb.group({
      correo : ['',[Validators.email,Validators.required]],
      password: ['',[Validators.required]]
    })
  }

  login() : void {
    this.mensajes.mensajeEsperar();
    
    if(this.formLogin.invalid){
      this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta', 'info');
      return;
    }

    this.apiLogin.login(this.formLogin.value).subscribe(
      respuesta => {
        if(respuesta.status != 200){
          this.mensajes.mensajeGenerico(respuesta.mensaje,'warning');
          return;
        }
        
        localStorage.setItem('token', respuesta.data.token);
        this.router.navigate(['/logistica/inicio']);
        this.mensajes.cerrarMensajes();
      }, error => {
        this.mensajes.mensajeGenerico('error', 'error');
      }
    );
  }

}
