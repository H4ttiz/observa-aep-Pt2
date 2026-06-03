import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {

  private readonly apiUrl = `${environment.apiUrl}/solicitacoes`;

  constructor(private http: HttpClient) {}
}
