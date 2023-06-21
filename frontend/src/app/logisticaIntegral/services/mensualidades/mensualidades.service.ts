import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensualidadesService {
  	private url = environment.api;

	constructor(
		private http : HttpClient
	) { }

	public obtenerMensualidadesSelect () : Observable<any> {
		return this.http.get<any>(this.url+'/mensualidades/obtenerMensualidadesSelect');
	}

	public obtenerMensualidades ( data : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/mensualidades/obtenerMensualidades', data);
	}
}
