import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
	private url = environment.api;

	constructor(
	  private http : HttpClient
	) { }

  	public obtenerEmpresasSelect () : Observable<any> {
    	return this.http.get<any>(this.url+'/empresas/obtenerEmpresasSelect');
  	}

  	public obtenerEmpresasMensualidadesSelect () : Observable<any> {
    	return this.http.get<any>(this.url+'/empresas/obtenerEmpresasMensualidadesSelect');
  	}

  	public obtenerEmpresasGenerales () : Observable<any> {
    	return this.http.get<any>(this.url+'/empresas/obtenerEmpresasGenerales');
  	}
}
