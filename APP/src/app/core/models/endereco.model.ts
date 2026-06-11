export interface EnderecoUsuario {
  id: number;
  cep: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface EnderecoUsuarioRequest {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface EnderecoSolicitacao extends EnderecoUsuario {
  latitude?: number;
  longitude?: number;
}
