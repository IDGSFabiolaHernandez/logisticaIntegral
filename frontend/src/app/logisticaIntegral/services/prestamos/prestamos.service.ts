import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  	private url = environment.api;

	constructor(
		private http : HttpClient
	) { }

	public obtenerSociosConRelacionEmpresas () : Observable<any> {
		return this.http.get<any>(this.url+'/prestamos/obtenerSociosConRelacionEmpresas');
	}
	
	public obtenerEmpresasSelectPorSocio (idSocio : number) : Observable<any> {
		return this.http.get<any>(this.url+'/prestamos/obtenerEmpresasSelectPorSocio/'+idSocio);
	}
	
	public obtenerSociosConPrestamos () : Observable<any> {
		return this.http.get<any>(this.url+'/prestamos/obtenerSociosConPrestamos');
	}

	public obtenerPrestamosPorSociosYStatus ( datosSocios : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/prestamos/obtenerPrestamosPorSociosYStatus', datosSocios);
	}
}
