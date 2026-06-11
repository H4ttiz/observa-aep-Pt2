export interface HistoricoResponse {
  id: number;
  statusAnterior?: string;
  statusNovo: string;
  observacao?: string;
  responsavelId: number;
  responsavelNome: string;
  dataAlteracao: string;
}
