import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, CategoriaRequest } from '../models/categoria.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listarTodas(ativo?: boolean, page = 0, size = 20): Observable<PageResponse<Categoria>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');
    if (ativo !== undefined) {
      params = params.set('ativo', String(ativo));
    }
    return this.http.get<PageResponse<Categoria>>(this.apiUrl, { params });
  }

  listarAtivas(page = 0, size = 20): Observable<PageResponse<Categoria>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'nome,asc');
    return this.http.get<PageResponse<Categoria>>(`${this.apiUrl}/ativas`, { params });
  }

  criar(dto: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, dto);
  }

  atualizar(id: number, dto: CategoriaRequest): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, dto);
  }

  ativar(id: number): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}/ativar`, {});
  }

  desativar(id: number): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}/desativar`, {});
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
