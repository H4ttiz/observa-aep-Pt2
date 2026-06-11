import { HistoricoResponse } from './historico.model';
import { ImagemSolicitacao } from './imagem.model';

export interface EnderecoSolicitacaoResponse {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface SolicitacaoResponse {
  id: number;
  titulo: string;
  descricao: string;
  categoriaId: number;
  categoriaNome: string;
  status: string;
  prioridade?: string;
  anonima: boolean;
  dataAbertura: string;
  dataPrazo?: string;
  dataFinalizacao?: string;
  solicitanteId?: number;
  solicitanteNome: string;
  atendenteId?: number;
  atendenteNome?: string;
  enderecoSolicitacao: EnderecoSolicitacaoResponse;
  imagens: ImagemSolicitacao[];
  historicos: HistoricoResponse[];
}

export interface EnderecoSolicitacaoRequest {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface SolicitacaoRequest {
  titulo: string;
  descricao: string;
  categoriaId: number;
  anonima: boolean;
  usarEnderecoUsuario: boolean;
  enderecoSolicitacao?: EnderecoSolicitacaoRequest;
  dataAbertura: string;
}

export interface SolicitacaoUpdateRequest {
  titulo: string;
  descricao: string;
  categoriaId: number;
  enderecoSolicitacao?: EnderecoSolicitacaoRequest;
}

export interface GestorAprovarRequest {
  prioridade: string;
  dataPrazo: string;
}

export interface GestorRejeitarRequest {
  observacao: string;
}

export interface RevealAnonimatoRequest {
  senhaAdm: string;
  observacao: string;
}

export interface VincularAtendenteRequest {
  atendenteId: number;
}

export interface SolicitacaoAdmUpdateRequest {
  titulo?: string;
  descricao?: string;
  categoriaId?: number;
  status?: string;
  prioridade?: string;
  dataPrazo?: string;
  dataFinalizacao?: string;
  enderecoSolicitacao?: EnderecoSolicitacaoRequest;
}

// Alias for backward compat in templates
export type Solicitacao = SolicitacaoResponse;
