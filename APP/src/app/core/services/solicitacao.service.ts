import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { ImagemSolicitacao } from '../models/imagem.model';
import {
  SolicitacaoResponse,
  SolicitacaoRequest,
  SolicitacaoUpdateRequest,
  GestorAprovarRequest,
  GestorRejeitarRequest,
  RevealAnonimatoRequest,
  VincularAtendenteRequest,
  SolicitacaoAdmUpdateRequest
} from '../models/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {

  private readonly apiUrl = `${environment.apiUrl}/api/solicitacoes`;

  constructor(private http: HttpClient) {}

  criar(dto: SolicitacaoRequest, imagens?: File[]): Observable<SolicitacaoResponse> {
    const form = new FormData();
    form.append('solicitacao', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (imagens?.length) {
      imagens.forEach(img => form.append('imagens', img));
    }
    return this.http.post<SolicitacaoResponse>(this.apiUrl, form);
  }

  atualizar(id: number, dto: SolicitacaoUpdateRequest): Observable<SolicitacaoResponse> {
    return this.http.put<SolicitacaoResponse>(`${this.apiUrl}/${id}`, dto);
  }

  minhas(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/minhas`, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  buscarPorId(id: number): Observable<SolicitacaoResponse> {
    return this.http.get<SolicitacaoResponse>(`${this.apiUrl}/${id}`);
  }

  aprovar(id: number, dto: GestorAprovarRequest): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/aprovar`, dto);
  }

  rejeitar(id: number, dto: GestorRejeitarRequest): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/rejeitar`, dto);
  }

  reativar(id: number): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/reativar`, {});
  }

  aguardandoAprovacao(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/aguardando-aprovacao`, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  rejeitadas(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/rejeitadas`, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  finalizadas(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/finalizadas`, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  emAndamento(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/em-andamento`, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  pegar(id: number): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/pegar`, {});
  }

  finalizar(id: number): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/finalizar`, {});
  }

  desvincular(id: number): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/desvincular`, {});
  }

  reabrir(id: number): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/reabrir`, {});
  }

  fila(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/fila`, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  finalizadasPorMim(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      `${this.apiUrl}/finalizadas-por-mim`, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  listarTodas(pagina = 0, tamanho = 20): Observable<PageResponse<SolicitacaoResponse>> {
    return this.http.get<PageResponse<SolicitacaoResponse>>(
      this.apiUrl, { params: { page: pagina, size: tamanho, sort: 'dataAbertura,desc' } }
    );
  }

  revelarAnonimato(id: number, dto: RevealAnonimatoRequest): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/revelar-anonimato`, dto);
  }

  vincularAtendente(id: number, dto: VincularAtendenteRequest): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/vincular-atendente`, dto);
  }

  admUpdate(id: number, dto: SolicitacaoAdmUpdateRequest): Observable<SolicitacaoResponse> {
    return this.http.patch<SolicitacaoResponse>(`${this.apiUrl}/${id}/admin-update`, dto);
  }

  adicionarImagens(id: number, arquivos: File[]): Observable<ImagemSolicitacao[]> {
    const form = new FormData();
    arquivos.forEach(a => form.append('arquivos', a));
    return this.http.post<ImagemSolicitacao[]>(`${this.apiUrl}/${id}/imagens`, form);
  }

  removerImagem(id: number, imgId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/imagens/${imgId}`);
  }
}
