export interface Solicitacao {
  id: number;
  titulo: string;
  descricao?: string;
  status: string;
  prioridade?: string;
  dataAbertura: string;
  dataPrazo?: string;
  dataFinalizacao?: string;
}
