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

	public obtenerMensualidadesPagadasSelect () : Observable<any> {
		return this.http.get<any>(this.url+'/mensualidades/obtenerMensualidadesPagadasSelect');
	}

	public obtenerMensualidades ( data : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/mensualidades/obtenerMensualidadesPagadasEmpresaSocios', data);
	}
	
	public obtenerMensualidadesPagarSelect () : Observable<any> {
		return this.http.get<any>(this.url+'/mensualidades/obtenerMensualidadesPagarSelect');
	}
	
	public obtenerMensualidadesPagarPorMensualidad ( mensualidad : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/mensualidades/obtenerMensualidadesPagarPorMensualidad', {mensualidad});
	}

	public pagarMensualidadEmpresaSocio ( dataMensualidadesPagar : any) : Observable<any> {
		return this.http.post<any>(this.url+'/mensualidades/pagarMensualidadEmpresaSocio', dataMensualidadesPagar);
	}
}