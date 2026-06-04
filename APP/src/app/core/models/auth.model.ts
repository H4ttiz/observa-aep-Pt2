export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tipoUsuario: string;
  nomeUsuario: string;
  expiresIn: number;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  celular?: string | null;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  celular: string;
  tipoUsuario: string;
  ativo: boolean;
  dataCriacao: string;
}
