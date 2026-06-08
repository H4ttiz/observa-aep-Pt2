import { HistoricoSolicitacao } from './historico.model';

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}

export interface PessoaRef {
  nome: string;
  email: string;
  cpf?: string;
  celular?: string;
}

export interface Solicitacao {
  id: number;
  titulo: string;
  descricao?: string;
  categoria?: string;
  status: string;
  prioridade?: string;
  dataAbertura: string;
  dataPrazo?: string;
  dataFinalizacao?: string;
  anonimo?: boolean;
  atrasada?: boolean;
  solicitante?: PessoaRef;
  atendente?: PessoaRef;
  gestor?: PessoaRef;
  motivoRejeicao?: string;
  observacoes?: string;
  endereco?: Endereco;
  historico?: HistoricoSolicitacao[];
}
