export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  dataCriacao: string;
  criadoPorId?: number;
  criadoPorNome?: string;
}

export interface CategoriaRequest {
  nome: string;
  descricao: string;
}
