export interface EnderecoUsuario {
  id: number;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface EnderecoSolicitacao extends EnderecoUsuario {
  latitude?: number;
  longitude?: number;
}
