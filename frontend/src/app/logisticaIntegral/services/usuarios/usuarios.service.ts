import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = environment.api;

  constructor(
    private http : HttpClient
  ) { }

  public obtenerInformacionUsuarioPorToken( token : any ) : Observable<any> {
    return this.http.post<any>(this.url+'/usuarios/obtenerInformacionUsuarioPorToken',{token});
  }
}