import { Solicitacao } from '../../core/models/solicitacao.model';
import { Usuario } from '../../core/models/usuario.model';
import { Categoria } from '../../core/models/categoria.model';
import { Log } from '../../core/models/log.model';

// TODO: substituir mock por chamadas HTTP aos endpoints reais

export const MOCK_SOLICITACOES: Solicitacao[] = [
  {
    id: 1001,
    titulo: 'Buraco na Rua das Palmeiras',
    descricao: 'Grande cratera no meio da rua que dificulta a passagem de veículos e representa risco aos pedestres.',
    categoria: 'Infraestrutura',
    status: 'AGUARDANDO_APROVACAO',
    prioridade: 'ALTA',
    dataAbertura: '2026-05-10',
    dataPrazo: '2026-06-10',
    anonimo: false,
    solicitante: { nome: 'Carlos Mendes', email: 'carlos@email.com', cpf: '123.456.789-00', celular: '(44) 99999-1234' },
    endereco: { rua: 'Rua das Palmeiras', numero: '320', bairro: 'Jardim América', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Solicitação registrada pelo cidadão.', dataMudanca: '2026-05-10T10:22:00' }
    ]
  },
  {
    id: 1002,
    titulo: 'Lixo acumulado na Praça Central',
    descricao: 'Acúmulo de lixo em frente à praça há mais de 5 dias sem coleta. Odor forte e risco sanitário.',
    categoria: 'Limpeza Urbana',
    status: 'APROVADA',
    prioridade: 'MEDIA',
    dataAbertura: '2026-05-12',
    dataPrazo: '2026-06-05',
    anonimo: false,
    solicitante: { nome: 'Ana Souza', email: 'ana@email.com', cpf: '234.567.890-11' },
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    endereco: { rua: 'Praça Central', numero: 'S/N', bairro: 'Centro', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Solicitação registrada.', dataMudanca: '2026-05-12T08:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'APROVADA', comentario: 'Aprovada pelo gestor. Prioridade definida como MÉDIA.', dataMudanca: '2026-05-13T14:30:00' }
    ]
  },
  {
    id: 1003,
    titulo: 'Poste sem iluminação — Av. Brasil',
    descricao: 'Poste apagado há 10 dias causando insegurança no trecho.',
    categoria: 'Iluminação Pública',
    status: 'AGUARDANDO_ATENDENTE',
    prioridade: 'ALTA',
    dataAbertura: '2026-05-08',
    dataPrazo: '2026-06-01',
    anonimo: true,
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    endereco: { rua: 'Avenida Brasil', numero: '1500', bairro: 'Vila Nova', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Solicitação registrada.', dataMudanca: '2026-05-08T09:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'APROVADA', comentario: 'Aprovada. Prioridade ALTA.', dataMudanca: '2026-05-09T10:00:00' },
      { id: 3, statusAnterior: 'APROVADA', statusNovo: 'AGUARDANDO_ATENDENTE', comentario: 'Aguardando atribuição de atendente.', dataMudanca: '2026-05-09T10:05:00' }
    ]
  },
  {
    id: 1004,
    titulo: 'Calçada danificada — Rua Colombo',
    descricao: 'Calçada com pedras soltas e buracos que causaram quedas de pedestres.',
    categoria: 'Infraestrutura',
    status: 'EM_ANDAMENTO',
    prioridade: 'MEDIA',
    dataAbertura: '2026-04-28',
    dataPrazo: '2026-05-28',
    anonimo: false,
    solicitante: { nome: 'Roberto Alves', email: 'roberto@email.com' },
    atendente: { nome: 'Mariana Costa', email: 'mariana.atendente@prefeitura.gov.br' },
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    observacoes: 'Equipe agendada para vistoria em 02/06.',
    endereco: { rua: 'Rua Colombo', numero: '780', bairro: 'Zona 7', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Registrada pelo cidadão.', dataMudanca: '2026-04-28T11:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'APROVADA', comentario: 'Aprovada. Prioridade MÉDIA.', dataMudanca: '2026-04-29T09:00:00' },
      { id: 3, statusAnterior: 'APROVADA', statusNovo: 'AGUARDANDO_ATENDENTE', comentario: 'Encaminhada para atendimento.', dataMudanca: '2026-04-29T09:10:00' },
      { id: 4, statusAnterior: 'AGUARDANDO_ATENDENTE', statusNovo: 'EM_ANDAMENTO', comentario: 'Atendente Mariana Costa assumiu o caso.', dataMudanca: '2026-05-02T14:00:00' }
    ]
  },
  {
    id: 1005,
    titulo: 'Poda de árvore em frente ao colégio',
    descricao: 'Galhos comprometendo a fiação elétrica e entrada da escola.',
    categoria: 'Meio Ambiente',
    status: 'FINALIZADA',
    prioridade: 'BAIXA',
    dataAbertura: '2026-04-15',
    dataPrazo: '2026-05-15',
    dataFinalizacao: '2026-05-10',
    anonimo: false,
    solicitante: { nome: 'Paulo Ferreira', email: 'paulo@email.com' },
    atendente: { nome: 'Mariana Costa', email: 'mariana.atendente@prefeitura.gov.br' },
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    endereco: { rua: 'Rua das Flores', numero: '90', bairro: 'Centro', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Registrada.', dataMudanca: '2026-04-15T08:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'APROVADA', comentario: 'Aprovada.', dataMudanca: '2026-04-16T09:00:00' },
      { id: 3, statusAnterior: 'APROVADA', statusNovo: 'AGUARDANDO_ATENDENTE', comentario: 'Aguardando atendente.', dataMudanca: '2026-04-16T09:05:00' },
      { id: 4, statusAnterior: 'AGUARDANDO_ATENDENTE', statusNovo: 'EM_ANDAMENTO', comentario: 'Atendente assumiu o caso.', dataMudanca: '2026-04-20T10:00:00' },
      { id: 5, statusAnterior: 'EM_ANDAMENTO', statusNovo: 'FINALIZADA', comentario: 'Poda realizada com sucesso.', dataMudanca: '2026-05-10T16:30:00' }
    ]
  },
  {
    id: 1006,
    titulo: 'Esgoto entupido — Vila Morangueira',
    descricao: 'Esgoto transbordando na calçada há 3 dias.',
    categoria: 'Saneamento',
    status: 'REJEITADA',
    prioridade: 'ALTA',
    dataAbertura: '2026-05-01',
    anonimo: false,
    solicitante: { nome: 'Juliana Neves', email: 'juliana@email.com' },
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    motivoRejeicao: 'Competência da SANEPAR — encaminhado para o órgão responsável.',
    endereco: { rua: 'Rua Morango', numero: '45', bairro: 'Vila Morangueira', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Registrada.', dataMudanca: '2026-05-01T07:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'REJEITADA', comentario: 'Fora da competência municipal.', dataMudanca: '2026-05-02T11:00:00' }
    ]
  },
  {
    id: 1007,
    titulo: 'Semáforo com defeito — Cruzamento da Av. Mandacaru',
    descricao: 'Semáforo piscando em amarelo há 2 semanas, causando congestionamentos e acidentes.',
    categoria: 'Trânsito',
    status: 'EM_ANDAMENTO',
    prioridade: 'URGENTE',
    dataAbertura: '2026-04-20',
    dataPrazo: '2026-05-01',
    anonimo: false,
    atrasada: true,
    solicitante: { nome: 'Marcos Oliveira', email: 'marcos@email.com' },
    atendente: { nome: 'João Pereira', email: 'joao.atendente@prefeitura.gov.br' },
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    endereco: { rua: 'Avenida Mandacaru', numero: 'S/N', bairro: 'Zona 2', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Registrada.', dataMudanca: '2026-04-20T08:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'APROVADA', comentario: 'URGENTE — aprovação imediata.', dataMudanca: '2026-04-20T09:00:00' },
      { id: 3, statusAnterior: 'APROVADA', statusNovo: 'AGUARDANDO_ATENDENTE', comentario: 'Aguardando técnico.', dataMudanca: '2026-04-20T09:05:00' },
      { id: 4, statusAnterior: 'AGUARDANDO_ATENDENTE', statusNovo: 'EM_ANDAMENTO', comentario: 'Técnico João Pereira designado.', dataMudanca: '2026-04-21T08:00:00' }
    ]
  },
  {
    id: 1008,
    titulo: 'Pichação em monumento histórico',
    descricao: 'Monumento da Praça da Catedral foi pichado durante a madrugada.',
    categoria: 'Patrimônio Público',
    status: 'AGUARDANDO_APROVACAO',
    prioridade: 'MEDIA',
    dataAbertura: '2026-05-20',
    dataPrazo: '2026-06-20',
    anonimo: true,
    endereco: { rua: 'Praça da Catedral', numero: 'S/N', bairro: 'Centro', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Registrada anonimamente.', dataMudanca: '2026-05-20T06:30:00' }
    ]
  },
  {
    id: 1009,
    titulo: 'Falta de acessibilidade na calçada da UPA',
    descricao: 'Ausência de rampas de acessibilidade prejudica cadeirantes.',
    categoria: 'Acessibilidade',
    status: 'FINALIZADA',
    prioridade: 'ALTA',
    dataAbertura: '2026-03-10',
    dataPrazo: '2026-04-10',
    dataFinalizacao: '2026-04-08',
    anonimo: false,
    solicitante: { nome: 'Beatriz Santos', email: 'beatriz@email.com' },
    atendente: { nome: 'Mariana Costa', email: 'mariana.atendente@prefeitura.gov.br' },
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    endereco: { rua: 'Rua Santa Catarina', numero: '200', bairro: 'Zona 2', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Registrada.', dataMudanca: '2026-03-10T10:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'APROVADA', comentario: 'Aprovada com prioridade ALTA.', dataMudanca: '2026-03-11T09:00:00' },
      { id: 3, statusAnterior: 'APROVADA', statusNovo: 'AGUARDANDO_ATENDENTE', comentario: 'Encaminhada.', dataMudanca: '2026-03-11T09:10:00' },
      { id: 4, statusAnterior: 'AGUARDANDO_ATENDENTE', statusNovo: 'EM_ANDAMENTO', comentario: 'Atendente assumiu.', dataMudanca: '2026-03-15T08:00:00' },
      { id: 5, statusAnterior: 'EM_ANDAMENTO', statusNovo: 'FINALIZADA', comentario: 'Rampas instaladas.', dataMudanca: '2026-04-08T17:00:00' }
    ]
  },
  {
    id: 1010,
    titulo: 'Playground do parque danificado',
    descricao: 'Equipamentos enferrujados e peças soltas oferecem risco às crianças.',
    categoria: 'Parques e Lazer',
    status: 'AGUARDANDO_ATENDENTE',
    prioridade: 'MEDIA',
    dataAbertura: '2026-05-15',
    dataPrazo: '2026-06-15',
    anonimo: false,
    solicitante: { nome: 'Larissa Campos', email: 'larissa@email.com' },
    gestor: { nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br' },
    endereco: { rua: 'Parque do Ingá', numero: 'S/N', bairro: 'Zona 3', cidade: 'Maringá' },
    historico: [
      { id: 1, statusAnterior: undefined, statusNovo: 'AGUARDANDO_APROVACAO', comentario: 'Registrada.', dataMudanca: '2026-05-15T14:00:00' },
      { id: 2, statusAnterior: 'AGUARDANDO_APROVACAO', statusNovo: 'APROVADA', comentario: 'Aprovada.', dataMudanca: '2026-05-16T09:00:00' },
      { id: 3, statusAnterior: 'APROVADA', statusNovo: 'AGUARDANDO_ATENDENTE', comentario: 'Aguardando atribuição.', dataMudanca: '2026-05-16T09:05:00' }
    ]
  }
];

export const MOCK_USUARIOS: Usuario[] = [
  { id: 1, nome: 'Admin Geral', email: 'admin@prefeitura.gov.br', tipoUsuario: 'ADMINISTRADOR', ativo: true, dataCriacao: '2025-01-01' },
  { id: 2, nome: 'Fernando Lima', email: 'fernando.gestor@prefeitura.gov.br', tipoUsuario: 'GESTOR', ativo: true, dataCriacao: '2025-01-15' },
  { id: 3, nome: 'Mariana Costa', email: 'mariana.atendente@prefeitura.gov.br', tipoUsuario: 'ATENDENTE', ativo: true, dataCriacao: '2025-02-01' },
  { id: 4, nome: 'João Pereira', email: 'joao.atendente@prefeitura.gov.br', tipoUsuario: 'ATENDENTE', ativo: true, dataCriacao: '2025-03-10' },
  { id: 5, nome: 'Carlos Mendes', email: 'carlos@email.com', tipoUsuario: 'CIDADAO', ativo: true, dataCriacao: '2025-04-05' },
  { id: 6, nome: 'Ana Souza', email: 'ana@email.com', tipoUsuario: 'CIDADAO', ativo: true, dataCriacao: '2025-04-20' },
  { id: 7, nome: 'Beatriz Santos', email: 'beatriz@email.com', tipoUsuario: 'CIDADAO', ativo: false, dataCriacao: '2025-05-01' }
];

export const MOCK_CATEGORIAS: Categoria[] = [
  { id: 1, nome: 'Infraestrutura', descricao: 'Buracos, calçadas, pontes e obras em geral', ativa: true },
  { id: 2, nome: 'Iluminação Pública', descricao: 'Postes apagados e problemas de iluminação', ativa: true },
  { id: 3, nome: 'Limpeza Urbana', descricao: 'Lixo, varrição e capina', ativa: true },
  { id: 4, nome: 'Trânsito', descricao: 'Semáforos, sinalização e fluxo de veículos', ativa: true },
  { id: 5, nome: 'Meio Ambiente', descricao: 'Poda, desmatamento e questões ambientais', ativa: true },
  { id: 6, nome: 'Saneamento', descricao: 'Esgoto, água e drenagem', ativa: false },
  { id: 7, nome: 'Patrimônio Público', descricao: 'Monumentos, prédios públicos e praças', ativa: true },
  { id: 8, nome: 'Acessibilidade', descricao: 'Rampas, calçadas e adaptações para PCD', ativa: true },
  { id: 9, nome: 'Parques e Lazer', descricao: 'Parques, playgrounds e áreas de esporte', ativa: true }
];

export const MOCK_LOGS: Log[] = [
  { id: 1, tipoLog: 'LOGIN', usuario: 'admin@prefeitura.gov.br', descricao: 'Login realizado com sucesso.', dataHora: '2026-06-05T08:02:11' },
  { id: 2, tipoLog: 'CRIACAO', usuario: 'carlos@email.com', descricao: 'Nova solicitação #1001 criada: "Buraco na Rua das Palmeiras".', dataHora: '2026-05-10T10:22:00' },
  { id: 3, tipoLog: 'ALTERACAO', usuario: 'fernando.gestor@prefeitura.gov.br', descricao: 'Solicitação #1002 aprovada com prioridade MÉDIA.', dataHora: '2026-05-13T14:30:00' },
  { id: 4, tipoLog: 'ALTERACAO', usuario: 'mariana.atendente@prefeitura.gov.br', descricao: 'Solicitação #1004 assumida — status alterado para EM_ANDAMENTO.', dataHora: '2026-05-02T14:00:00' },
  { id: 5, tipoLog: 'ALTERACAO', usuario: 'fernando.gestor@prefeitura.gov.br', descricao: 'Solicitação #1006 rejeitada: fora da competência municipal.', dataHora: '2026-05-02T11:00:00' },
  { id: 6, tipoLog: 'ACESSO_NEGADO', usuario: 'carlos@email.com', descricao: 'Tentativa de acesso não autorizado à rota /dashboard/admin.', dataHora: '2026-05-10T11:00:00' },
  { id: 7, tipoLog: 'CRIACAO', usuario: 'admin@prefeitura.gov.br', descricao: 'Novo usuário criado: joao.atendente@prefeitura.gov.br (ATENDENTE).', dataHora: '2025-03-10T09:00:00' },
  { id: 8, tipoLog: 'EXCLUSAO', usuario: 'admin@prefeitura.gov.br', descricao: 'Categoria #6 (Saneamento) desativada.', dataHora: '2026-04-01T15:30:00' },
  { id: 9, tipoLog: 'ALTERACAO', usuario: 'mariana.atendente@prefeitura.gov.br', descricao: 'Solicitação #1005 finalizada com sucesso.', dataHora: '2026-05-10T16:30:00' },
  { id: 10, tipoLog: 'LOGIN', usuario: 'joao.atendente@prefeitura.gov.br', descricao: 'Login realizado com sucesso.', dataHora: '2026-06-05T07:45:00' }
];
