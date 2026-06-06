import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioRequest, UsuarioUpdateRequest, UsuarioSelfUpdateRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  buscarPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }

  criar(dto: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, dto);
  }

  atualizar(id: number, dto: UsuarioUpdateRequest): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, dto);
  }

  atualizarSelf(dto: UsuarioSelfUpdateRequest): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/perfil`, dto);
  }

  atualizarFoto(foto: File): Observable<Usuario> {
    const form = new FormData();
    form.append('foto', foto);
    return this.http.patch<Usuario>(`${this.apiUrl}/perfil/foto`, form);
  }

  ativar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/ativar`, {});
  }

  desativar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/desativar`, {});
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
