import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Log } from '../models/log.model';

@Injectable({ providedIn: 'root' })
export class LogService {

  private readonly apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl);
  }

  listarPorTipo(tipo: string): Observable<Log[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<Log[]>(this.apiUrl, { params });
  }
}
