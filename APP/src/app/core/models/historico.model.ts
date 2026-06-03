export interface HistoricoSolicitacao {
  id: number;
  statusAnterior?: string;
  statusNovo: string;
  comentario: string;
  dataMudanca: string;
}
