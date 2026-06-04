import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  CadastroRequest,
  UsuarioResponse
} from '../models/auth.model';

const TOKEN_KEY    = 'oa_accessToken';
const REFRESH_KEY  = 'oa_refreshToken';
const TIPO_KEY     = 'oa_tipoUsuario';
const NOME_KEY     = 'oa_nomeUsuario';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private _autenticado$ = new BehaviorSubject<boolean>(this.temToken());
  readonly autenticado$ = this._autenticado$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY,   res.accessToken);
        localStorage.setItem(REFRESH_KEY, res.refreshToken);
        localStorage.setItem(TIPO_KEY,    res.tipoUsuario);
        localStorage.setItem(NOME_KEY,    res.nomeUsuario);
        this._autenticado$.next(true);
      })
    );
  }

  cadastrar(payload: CadastroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/cadastro`, payload);
  }

  logout(): void {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        complete: () => this.limparSessao()
      });
    } else {
      this.limparSessao();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getNomeUsuario(): string | null {
    return localStorage.getItem(NOME_KEY);
  }

  getTipoUsuario(): string | null {
    return localStorage.getItem(TIPO_KEY);
  }

  isLoggedIn(): boolean {
    return this.temToken();
  }

  private temToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  private limparSessao(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(TIPO_KEY);
    localStorage.removeItem(NOME_KEY);
    this._autenticado$.next(false);
    this.router.navigate(['/auth']);
  }
}
