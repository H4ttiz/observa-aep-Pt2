import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../core/services/toast.service';
import { Solicitacao } from '../../../core/models/solicitacao.model';
import { Usuario, UsuarioRequest } from '../../../core/models/usuario.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Log } from '../../../core/models/log.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { NavbarLateralComponent, NavItem } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SolicitacaoDetalhesComponent } from '../../../shared/components/solicitacao-detalhes/solicitacao-detalhes.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { FieldErrorComponent } from '../../../shared/components/field-error/field-error.component';
import { MOCK_SOLICITACOES, MOCK_CATEGORIAS, MOCK_LOGS } from '../../../shared/mock-data/mock-data';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe, FormsModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, SolicitacaoDetalhesComponent,
    PasswordInputComponent, FieldErrorComponent
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

  logs: Log[] = MOCK_LOGS;
  filtroLog = '';

  solicitacoes: Solicitacao[] = MOCK_SOLICITACOES;

  usuarios: Usuario[] = [];
  carregandoUsuarios = false;

  categorias: Categoria[] = MOCK_CATEGORIAS;

  selectedSolicitacao: Solicitacao | null = null;

  // Modais
  showModalUsuario = false;
  showModalCategoria = false;
  showModalConfirmDelete = false;
  showModalConfirmDesativar = false;
  showModalRemoverAnonimato = false;
  modalSubmitted = false;

  confirmDeleteTarget: Usuario | null = null;
  confirmDesativarTarget: Usuario | null = null;

  novoUsuario: UsuarioRequest = {
    nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', celular: '', tipoUsuario: ''
  };
  novaCategoria = { nome: '', descricao: '' };

  get logsExibidos(): Log[] {
    if (!this.filtroLog) return this.logs;
    return this.logs.filter(l => l.tipoLog === this.filtroLog);
  }

  get stats() {
    return {
      usuarios:     this.usuarios.length,
      solicitacoes: this.solicitacoes.length,
      categorias:   this.categorias.filter(c => c.ativa).length
    };
  }

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab) this.activeTab = tab;
    this.carregarUsuarios();
  }

  setTab(id: string): void {
    this.activeTab = id;
    if (id === 'usuarios') this.carregarUsuarios();
  }

  verDetalhes(s: Solicitacao): void { this.selectedSolicitacao = s; }

  // ── Usuários ─────────────────────────────────────────────────────────────

  carregarUsuarios(): void {
    this.carregandoUsuarios = true;
    this.usuarioService.listarTodos().subscribe({
      next: lista => { this.usuarios = lista; this.carregandoUsuarios = false; },
      error: err  => {
        this.toast.error(err.error?.erro ?? 'Erro ao carregar usuários');
        this.carregandoUsuarios = false;
      }
    });
  }

  podeModificar(u: Usuario): boolean {
    // ADM raiz (criadoPorId null) ou criado por outro ADM → false
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
        this.carregarUsuarios();
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
        this.carregarUsuarios();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao desativar usuário')
    });
  }

  onAtivar(u: Usuario): void {
    this.usuarioService.ativar(u.id).subscribe({
      next: () => { this.toast.success('Usuário ativado.'); this.carregarUsuarios(); },
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
        this.carregarUsuarios();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao excluir usuário')
    });
  }

  // ── Categorias ────────────────────────────────────────────────────────────

  onCriarCategoria(): void {
    alert('Em breve: integração com o backend de categorias');
    this.showModalCategoria = false;
  }

  onExcluirCategoria(nome: string): void {
    alert('Em breve: integração com o backend de categorias');
  }

  // ── Solicitações ──────────────────────────────────────────────────────────

  onRemoverAnonimato(): void { this.showModalRemoverAnonimato = true; }

  confirmarRemoverAnonimato(): void {
    alert('Em breve: integração com o backend');
    this.showModalRemoverAnonimato = false;
  }

  logout(): void { this.auth.logout(); }
}
