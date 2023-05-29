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
}