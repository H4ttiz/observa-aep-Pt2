import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Log } from '../models/log.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class LogService {

  private readonly apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}

  listarTodos(page = 0, size = 20): Observable<PageResponse<Log>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'dataRegistro,desc');
    return this.http.get<PageResponse<Log>>(this.apiUrl, { params });
  }

  listarPorTipo(tipo: string, page = 0, size = 20): Observable<PageResponse<Log>> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('page', page)
      .set('size', size)
      .set('sort', 'dataRegistro,desc');
    return this.http.get<PageResponse<Log>>(this.apiUrl, { params });
  }
}
