import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/logisticaIntegral/services/data.service';
import { MensajesService } from '../../../../services/mensajes/mensajes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  constructor(
    private dataService : DataService,
    private mensajes : MensajesService,
    private router : Router
  ){}

  ngOnInit(): void {
    
  }

  prueba() : void {
    this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
  }

  logout() : void {
    this.mensajes.mensajeEsperar();
    this.router.navigate(['/']);
    this.mensajes.mensajeGenerico('Vuelva pronto', 'info');
  }
}
