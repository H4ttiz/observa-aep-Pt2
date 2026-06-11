import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class CepService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/cep`;

  buscarPorCep(cep: string): Observable<CepResponse> {
    return this.http.get<CepResponse>(`${this.apiUrl}/${cep}`);
  }
}
