import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{

  constructor(
    private http : HttpClient
  ){

  }

  ngOnInit(): void {
    
  }

  generarPdf(data : any){
    const blob = new Blob([data],{type:'application/pdf'});
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'prueba.pdf';
    anchor.click();
  }

  descargarPdf(){
    window.open('http://localhost:8000/api/descargaPdf');
    /*this.http.get('http://localhost:8000/api/descargaPdf',{responseType:'blob'}).subscribe(
      respuesta =>{
        this.generarPdf(respuesta);
      },
      error =>{
        console.log(error);
      }
    );*/
  }

}
