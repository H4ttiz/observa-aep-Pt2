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
}
