import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/logisticaIntegral/services/data.service';
import { MensajesService } from '../../../../services/mensajes/mensajes.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  constructor(
    private dataService : DataService,
    private mensajes : MensajesService,
    private router : Router,
    private apiLogin : LoginService
  ){}

  ngOnInit(): void {
    
  }

  prueba() : void {
    this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
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
}
