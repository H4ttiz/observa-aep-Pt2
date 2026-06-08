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
const USER_ID_KEY  = 'oa_userId';
const FOTO_KEY     = 'oa_fotoPerfil';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private _autenticado$ = new BehaviorSubject<boolean>(this.temToken());
  readonly autenticado$ = this._autenticado$.asObservable();

  private _fotoPerfil$ = new BehaviorSubject<string | null>(localStorage.getItem(FOTO_KEY));
  readonly fotoPerfil$ = this._fotoPerfil$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY,   res.accessToken);
        localStorage.setItem(REFRESH_KEY, res.refreshToken);
        localStorage.setItem(TIPO_KEY,    res.tipoUsuario);
        localStorage.setItem(NOME_KEY,    res.nomeUsuario);
        localStorage.setItem(USER_ID_KEY, String(res.userId));
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
        complete: () => this.limparSessao(),
        error:    () => this.limparSessao()
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

  getUserId(): number | null {
    const v = localStorage.getItem(USER_ID_KEY);
    return v ? Number(v) : null;
  }

  getFotoPerfil(): string | null {
    return this._fotoPerfil$.value;
  }

  setFotoPerfil(url: string | null): void {
    this._fotoPerfil$.next(url);
    if (url) localStorage.setItem(FOTO_KEY, url);
    else localStorage.removeItem(FOTO_KEY);
  }

  isLoggedIn(): boolean {
    return this.temToken();
  }

  private temToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  limparSessao(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(TIPO_KEY);
    localStorage.removeItem(NOME_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(FOTO_KEY);
    this._fotoPerfil$.next(null);
    this._autenticado$.next(false);
    this.router.navigate(['/auth']);
  }
}
