import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ToastService } from '../../../core/services/toast.service';
import { Solicitacao } from '../../../core/models/solicitacao.model';
import { Usuario, UsuarioRequest } from '../../../core/models/usuario.model';
import { Categoria, CategoriaRequest } from '../../../core/models/categoria.model';
import { Log } from '../../../core/models/log.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { NavbarLateralComponent, NavItem } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SolicitacaoDetalhesComponent } from '../../../shared/components/solicitacao-detalhes/solicitacao-detalhes.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { FieldErrorComponent } from '../../../shared/components/field-error/field-error.component';
import { PaginacaoComponent } from '../../../shared/components/paginacao/paginacao.component';
import { LogService } from '../../../core/services/log.service';
import { MOCK_SOLICITACOES } from '../../../shared/mock-data/mock-data';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe, FormsModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, SolicitacaoDetalhesComponent,
    PasswordInputComponent, FieldErrorComponent, PaginacaoComponent
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {

  nome = this.auth.getNomeUsuario() ?? 'Administrador';
  loggedUserId = this.auth.getUserId();
  activeTab = 'inicio';

  navItems: NavItem[] = [
    { id: 'inicio',       icon: 'home',              label: 'Início' },
    { id: 'logs',         icon: 'receipt_long',      label: 'Logs do Sistema' },
    { id: 'solicitacoes', icon: 'assignment',        label: 'Todas as Solicitações' },
    { id: 'usuarios',     icon: 'group',             label: 'Usuários' },
    { id: 'categorias',   icon: 'sell',              label: 'Categorias' }
  ];

  // ── Logs ──────────────────────────────────────────────────────────────────
  logs: Log[] = [];
  carregandoLogs = false;
  filtroLog = '';
  paginaAtualLogs = 0;
  totalPaginasLogs = 0;
  primeiroLogs = true;
  ultimoLogs = false;
  totalElementosLogs = 0;

  // ── Usuários ──────────────────────────────────────────────────────────────
  usuarios: Usuario[] = [];
  carregandoUsuarios = false;
  paginaAtualUsuarios = 0;
  totalPaginasUsuarios = 0;
  primeiroUsuarios = true;
  ultimoUsuarios = false;
  totalElementosUsuarios = 0;

  // ── Solicitações (mock — aguardando endpoint GET /solicitacoes) ────────────
  // TODO: mock — aguardando endpoint GET /solicitacoes
  solicitacoes: Solicitacao[] = MOCK_SOLICITACOES;
  selectedSolicitacao: Solicitacao | null = null;

  // ── Categorias ────────────────────────────────────────────────────────────
  categorias: Categoria[] = [];
  carregandoCategorias = false;
  paginaAtualCategorias = 0;
  totalPaginasCategorias = 0;
  primeiroCategorias = true;
  ultimoCategorias = false;
  totalElementosCategorias = 0;
  totalCategoriasAtivas = 0;
  filtroCategorias = '';

  // ── Modais ────────────────────────────────────────────────────────────────
  showModalUsuario = false;
  showModalCategoria = false;
  showModalConfirmDelete = false;
  showModalConfirmDesativar = false;
  showModalRemoverAnonimato = false;
  showModalConfirmDesativarCategoria = false;
  showModalConfirmExcluirCategoria = false;

  modalSubmitted = false;
  modalCategoriaSubmitted = false;

  confirmDeleteTarget: Usuario | null = null;
  confirmDesativarTarget: Usuario | null = null;
  confirmCategoriaTarget: Categoria | null = null;

  categoriaModalModo: 'criar' | 'editar' = 'criar';
  categoriaEditandoId: number | null = null;

  novoUsuario: UsuarioRequest = {
    nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', celular: '', tipoUsuario: ''
  };
  novaCategoria: CategoriaRequest = { nome: '', descricao: '' };

  get logsExibidos(): Log[] { return this.logs; }

  get stats() {
    return {
      usuarios:     this.totalElementosUsuarios,
      solicitacoes: this.solicitacoes.length,
      categorias:   this.totalCategoriasAtivas
    };
  }

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private logService: LogService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab) this.activeTab = tab;
    this.carregarUsuarios();
    this.carregarEstatisticasCategorias();
    if (this.activeTab === 'logs')       this.carregarLogs();
    if (this.activeTab === 'categorias') this.carregarCategorias();
  }

  setTab(id: string): void {
    this.activeTab = id;
    if (id === 'usuarios')   this.carregarUsuarios(0);
    if (id === 'logs')       this.carregarLogs(0);
    if (id === 'categorias') this.carregarCategorias(0);
  }

  // ── Logs ──────────────────────────────────────────────────────────────────

  carregarLogs(pagina = 0): void {
    this.carregandoLogs = true;
    const obs = this.filtroLog
      ? this.logService.listarPorTipo(this.filtroLog, pagina)
      : this.logService.listarTodos(pagina);
    obs.subscribe({
      next: res => {
        this.logs = res.content;
        this.paginaAtualLogs = res.number;
        this.totalPaginasLogs = res.totalPages;
        this.primeiroLogs = res.first;
        this.ultimoLogs = res.last;
        this.totalElementosLogs = res.totalElements;
        this.carregandoLogs = false;
      },
      error: () => { this.toast.error('Erro ao carregar logs'); this.carregandoLogs = false; }
    });
  }

  onFiltroLogChange(): void { this.carregarLogs(0); }

  onPaginaLogsMudou(pagina: number): void {
    this.carregarLogs(pagina);
    document.getElementById('logs-tab')?.scrollIntoView({ behavior: 'smooth' });
  }

  verDetalhes(s: Solicitacao): void { this.selectedSolicitacao = s; }

  // ── Usuários ──────────────────────────────────────────────────────────────

  carregarUsuarios(pagina = 0): void {
    this.carregandoUsuarios = true;
    this.usuarioService.listarTodos(pagina).subscribe({
      next: res => {
        this.usuarios = res.content;
        this.paginaAtualUsuarios = res.number;
        this.totalPaginasUsuarios = res.totalPages;
        this.primeiroUsuarios = res.first;
        this.ultimoUsuarios = res.last;
        this.totalElementosUsuarios = res.totalElements;
        this.carregandoUsuarios = false;
      },
      error: err => {
        this.toast.error(err.error?.erro ?? 'Erro ao carregar usuários');
        this.carregandoUsuarios = false;
      }
    });
  }

  onPaginaUsuariosMudou(pagina: number): void {
    this.carregarUsuarios(pagina);
    document.getElementById('usuarios-tab')?.scrollIntoView({ behavior: 'smooth' });
  }

  podeModificar(u: Usuario): boolean {
    return u.criadoPorId != null && u.criadoPorId === this.loggedUserId;
  }

  verUsuario(u: Usuario): void {
    this.router.navigate(['/dashboard/admin/usuarios', u.id]);
  }

  onAbrirModalUsuario(): void {
    this.novoUsuario = { nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', celular: '', tipoUsuario: '' };
    this.modalSubmitted = false;
    this.showModalUsuario = true;
  }

  onCriarUsuario(formRef: any): void {
    this.modalSubmitted = true;
    if (formRef.invalid) return;
    this.usuarioService.criar(this.novoUsuario).subscribe({
      next: () => {
        this.showModalUsuario = false;
        this.toast.success('Usuário criado com sucesso!');
        this.carregarUsuarios(0);
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao criar usuário')
    });
  }

  onDesativar(u: Usuario): void {
    this.confirmDesativarTarget = u;
    this.showModalConfirmDesativar = true;
  }

  confirmarDesativar(): void {
    if (!this.confirmDesativarTarget) return;
    this.usuarioService.desativar(this.confirmDesativarTarget.id).subscribe({
      next: () => {
        this.showModalConfirmDesativar = false;
        this.toast.success('Usuário desativado.');
        this.carregarUsuarios(this.paginaAtualUsuarios);
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao desativar usuário')
    });
  }

  onAtivar(u: Usuario): void {
    this.usuarioService.ativar(u.id).subscribe({
      next: () => { this.toast.success('Usuário ativado.'); this.carregarUsuarios(this.paginaAtualUsuarios); },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao ativar usuário')
    });
  }

  onExcluir(u: Usuario): void {
    this.confirmDeleteTarget = u;
    this.showModalConfirmDelete = true;
  }

  confirmarExclusao(): void {
    if (!this.confirmDeleteTarget) return;
    this.usuarioService.excluir(this.confirmDeleteTarget.id).subscribe({
      next: () => {
        this.showModalConfirmDelete = false;
        this.toast.success('Usuário excluído permanentemente.');
        this.carregarUsuarios(0);
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao excluir usuário')
    });
  }

  // ── Categorias ────────────────────────────────────────────────────────────

  carregarEstatisticasCategorias(): void {
    this.categoriaService.listarAtivas(0, 1).subscribe({
      next: res => this.totalCategoriasAtivas = res.totalElements,
      error: () => {}
    });
  }

  carregarCategorias(pagina = 0): void {
    this.carregandoCategorias = true;
    const filtro = this.filtroCategorias === '' ? undefined : this.filtroCategorias === 'true';
    this.categoriaService.listarTodas(filtro, pagina).subscribe({
      next: res => {
        this.categorias = res.content;
        this.paginaAtualCategorias = res.number;
        this.totalPaginasCategorias = res.totalPages;
        this.primeiroCategorias = res.first;
        this.ultimoCategorias = res.last;
        this.totalElementosCategorias = res.totalElements;
        this.carregandoCategorias = false;
      },
      error: err => {
        this.toast.error(err.error?.erro ?? 'Erro ao carregar categorias');
        this.carregandoCategorias = false;
      }
    });
  }

  onFiltroCategoriaChange(): void { this.carregarCategorias(0); }

  onPaginaCategoriasMudou(pagina: number): void {
    this.carregarCategorias(pagina);
    document.getElementById('categorias-tab')?.scrollIntoView({ behavior: 'smooth' });
  }

  onAbrirModalCategoria(): void {
    this.categoriaModalModo = 'criar';
    this.categoriaEditandoId = null;
    this.novaCategoria = { nome: '', descricao: '' };
    this.modalCategoriaSubmitted = false;
    this.showModalCategoria = true;
  }

  onEditarCategoria(c: Categoria): void {
    this.categoriaModalModo = 'editar';
    this.categoriaEditandoId = c.id;
    this.novaCategoria = { nome: c.nome, descricao: c.descricao };
    this.modalCategoriaSubmitted = false;
    this.showModalCategoria = true;
  }

  onSalvarCategoria(formRef: any): void {
    this.modalCategoriaSubmitted = true;
    if (formRef.invalid) return;

    if (this.categoriaModalModo === 'criar') {
      this.categoriaService.criar(this.novaCategoria).subscribe({
        next: () => {
          this.showModalCategoria = false;
          this.toast.success('Categoria criada com sucesso!');
          this.carregarCategorias(0);
          this.carregarEstatisticasCategorias();
        },
        error: err => this.toast.error(err.error?.erro ?? 'Erro ao criar categoria')
      });
    } else {
      this.categoriaService.atualizar(this.categoriaEditandoId!, this.novaCategoria).subscribe({
        next: () => {
          this.showModalCategoria = false;
          this.toast.success('Categoria atualizada com sucesso!');
          this.carregarCategorias(this.paginaAtualCategorias);
        },
        error: err => this.toast.error(err.error?.erro ?? 'Erro ao atualizar categoria')
      });
    }
  }

  onAtivarCategoria(c: Categoria): void {
    this.categoriaService.ativar(c.id).subscribe({
      next: () => {
        this.toast.success('Categoria ativada.');
        this.carregarCategorias(this.paginaAtualCategorias);
        this.carregarEstatisticasCategorias();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao ativar categoria')
    });
  }

  onDesativarCategoria(c: Categoria): void {
    this.confirmCategoriaTarget = c;
    this.showModalConfirmDesativarCategoria = true;
  }

  confirmarDesativarCategoria(): void {
    if (!this.confirmCategoriaTarget) return;
    this.categoriaService.desativar(this.confirmCategoriaTarget.id).subscribe({
      next: () => {
        this.showModalConfirmDesativarCategoria = false;
        this.toast.success('Categoria desativada.');
        this.carregarCategorias(this.paginaAtualCategorias);
        this.carregarEstatisticasCategorias();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao desativar categoria')
    });
  }

  onExcluirCategoria(c: Categoria): void {
    this.confirmCategoriaTarget = c;
    this.showModalConfirmExcluirCategoria = true;
  }

  confirmarExclusaoCategoria(): void {
    if (!this.confirmCategoriaTarget) return;
    this.categoriaService.excluir(this.confirmCategoriaTarget.id).subscribe({
      next: () => {
        this.showModalConfirmExcluirCategoria = false;
        this.toast.success('Categoria excluída permanentemente.');
        this.carregarCategorias(0);
        this.carregarEstatisticasCategorias();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao excluir categoria')
    });
  }

  // ── Solicitações ──────────────────────────────────────────────────────────

  onRemoverAnonimato(): void { this.showModalRemoverAnonimato = true; }

  confirmarRemoverAnonimato(): void {
    alert('Em breve: integração com o backend');
    this.showModalRemoverAnonimato = false;
  }

  logout(): void { this.auth.logout(); }
}
