import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  	providedIn: 'root'
})
export class SociosService {
	private url = environment.api;

	constructor(
		private http : HttpClient
	) { }

	public obtenerListaSocios ( socios : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/socios/listaSocios', socios);
	}

	public obtenerSociosSelect () : Observable<any> {
		return this.http.get<any>(this.url+'/socios/obtenerSociosSelect');
	}

	public obtenerRegistrosPorBloque () : Observable<any> {
		return this.http.get<any>(this.url+'/socios/obtenerRegistrosPorBloque');
	}

	public obtenerListaSociosPorBloque ( bloque : any) : Observable<any> {
		return this.http.get<any>(this.url+'/socios/obtenerListaSociosPorBloque/'+ bloque);
	}

	public obtenerSociosMensualidadesSelect () : Observable<any> {
		return this.http.get<any>(this.url+'/socios/obtenerSociosMensualidadesSelect');
	}

	public registrarSocio ( datosSocio : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/socios/registroNuevoSocio', datosSocio);
	}

	public obtenerSociosEmpresas ( data : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/socios/obtenerSociosEmpresas', data);
	}

	public generarEnlaceSocioEmpresa ( datosEnlace : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/socios/generarEnlaceSocioEmpresa', datosEnlace);
	}

	public obtenerSociosGenerales () : Observable<any> {
		return this.http.get<any>(this.url+'/socios/obtenerSociosGenerales');
	}

	public obtenerDetalleSocioPorId ( idSocio : number ) : Observable<any> {
		return this.http.get<any>(this.url+'/socios/obtenerDetalleSocioPorId/'+idSocio);
	}
	
	public obtenerDetalleSocioEspecial ( idSocio : number ) : Observable<any> {
		return this.http.get<any>(this.url+'/socios/detalle/obtenerDetalleSocioEspecial/'+idSocio);
	}

	public modificarSocio ( socioModificado : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/socios/modificarSocio', socioModificado);
	}

	public obtenerDetalleSocioEmpresaPorId ( idEnlace : number ) : Observable<any> {
		return this.http.get<any>(this.url+'/socios/obtenerDetalleSocioEmpresaPorId/'+idEnlace);
	}

	public modificarEnlaceSocioEmpresa ( enlaceModificado : any ) : Observable<any> {
		return this.http.post<any>(this.url+'/socios/modificarEnlaceSocioEmpresa', enlaceModificado);
	}
}