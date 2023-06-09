import { AfterViewInit, Component } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import { LoginService } from 'src/app/auth/service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invalid-route',
  templateUrl: './invalid-route.component.html',
  styleUrls: ['./invalid-route.component.css']
})
export class InvalidRouteComponent implements AfterViewInit{
	constructor (
		private mensajes : MensajesService,
		private apiLogin : LoginService,
		private router : Router
	) {

	}

	ngAfterViewInit(): void {
		this.mensajes.mensajeEsperar();
		let token = localStorage.getItem('token');
		if(token != undefined){
		this.apiLogin.auth(token).subscribe(
			status =>{
			if(status){
				this.router.navigate(['/logistica/inicio']);
				this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
			} else {
				localStorage.removeItem('token');
				localStorage.clear();
				this.router.navigate(['/']);
				this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
			}
			},

			error =>{
			this.router.navigate(['/']);    
			this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
			}
		);
		
		} else {
		this.router.navigate(['/']);    
		this.mensajes.mensajeGenerico('No deberías intentar esto', 'error');
		}
	}
}