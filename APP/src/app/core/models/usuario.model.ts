export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  celular?: string;
  fotoPerfil?: string;
  tipoUsuario: string;
  dataCriacao: string;
  ativo: boolean;
  criadoPorId?: number;
  criadoPorNome?: string;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  celular?: string;
  tipoUsuario: string;
}

export interface UsuarioUpdateRequest {
  nome?: string;
  email?: string;
  cpf?: string;
  celular?: string;
  tipoUsuario?: string;
}

export interface UsuarioSelfUpdateRequest {
  nome?: string;
  celular?: string;
  senhaAtual?: string;
  novaSenha?: string;
  confirmarNovaSenha?: string;
}
