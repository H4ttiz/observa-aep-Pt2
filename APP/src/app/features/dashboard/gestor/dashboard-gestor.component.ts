import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { ToastService } from '../../../core/services/toast.service';
import { SolicitacaoResponse } from '../../../core/models/solicitacao.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { NavbarLateralComponent, NavItem } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PaginacaoComponent } from '../../../shared/components/paginacao/paginacao.component';

@Component({
  selector: 'app-dashboard-gestor',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, PaginacaoComponent
  ],
  templateUrl: './dashboard-gestor.component.html',
  styleUrl: './dashboard-gestor.component.scss'
})
export class DashboardGestorComponent implements OnInit {
  nome = this.auth.getNomeUsuario() ?? 'Gestor';
  activeTab = 'inicio';

  navItems: NavItem[] = [
    { id: 'inicio',       icon: 'home',            label: 'Início' },
    { id: 'aprovacao',    icon: 'pending_actions',  label: 'Ag. Aprovação' },
    { id: 'andamento',    icon: 'sync',             label: 'Em Andamento' },
    { id: 'atrasadas',    icon: 'alarm_off',        label: 'Atrasadas' },
    { id: 'recusadas',    icon: 'cancel',           label: 'Recusadas' },
    { id: 'finalizadas',  icon: 'check_circle',     label: 'Finalizadas' },
    { id: 'relatorio',    icon: 'bar_chart',        label: 'Relatório' }
  ];

  // ── Listas ────────────────────────────────────────────────────────────────
  aguardandoAprovacaoList: SolicitacaoResponse[] = [];
  emAndamentoList: SolicitacaoResponse[] = [];
  atrasadasList: SolicitacaoResponse[] = [];
  recusadasList: SolicitacaoResponse[] = [];

  carregando = false;

  paginaAprovacao = 0; totalPaginasAprovacao = 0; primeiroAprovacao = true; ultimoAprovacao = false; totalAprovacao = 0;
  paginaAndamento = 0; totalPaginasAndamento = 0; primeiroAndamento = true; ultimoAndamento = false;
  paginaAtrasadas = 0; totalPaginasAtrasadas = 0; primeiroAtrasadas = true; ultimoAtrasadas = false;
  paginaRecusadas = 0; totalPaginasRecusadas = 0; primeiroRecusadas = true; ultimoRecusadas = false;
  finalizadasList: SolicitacaoResponse[] = [];
  paginaFinalizadas = 0; totalPaginasFinalizadas = 0; primeiroFinalizadas = true; ultimoFinalizadas = false; totalFinalizadas = 0;

  constructor(
    private auth: AuthService,
    private service: SolicitacaoService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAprovacao();
    this.carregarEstatisticasInicio();
  }

  get totalStats() {
    return { aguardandoAprovacao: this.totalAprovacao };
  }

  setTab(id: string): void {
    this.activeTab = id;
    if (id === 'aprovacao') this.carregarAprovacao(0);
    if (id === 'andamento')   this.carregarAndamento(0);
    if (id === 'atrasadas')   this.carregarAtrasadas();
    if (id === 'recusadas')   this.carregarRecusadas(0);
    if (id === 'finalizadas') this.carregarFinalizadas(0);
  }

  // ── Carregamentos ─────────────────────────────────────────────────────────

  private carregarEstatisticasInicio(): void {
    this.service.aguardandoAprovacao(0, 1).subscribe({
      next: r => this.totalAprovacao = r.totalElements,
      error: () => {}
    });
  }

  carregarAprovacao(pagina = 0): void {
    this.carregando = true;
    this.service.aguardandoAprovacao(pagina).subscribe({
      next: res => {
        this.aguardandoAprovacaoList = res.content;
        this.paginaAprovacao = res.number;
        this.totalPaginasAprovacao = res.totalPages;
        this.primeiroAprovacao = res.first;
        this.ultimoAprovacao = res.last;
        this.totalAprovacao = res.totalElements;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar solicitações'); this.carregando = false; }
    });
  }

  carregarAndamento(pagina = 0): void {
    this.carregando = true;
    this.service.emAndamento(pagina).subscribe({
      next: res => {
        this.emAndamentoList = res.content;
        this.paginaAndamento = res.number;
        this.totalPaginasAndamento = res.totalPages;
        this.primeiroAndamento = res.first;
        this.ultimoAndamento = res.last;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar solicitações'); this.carregando = false; }
    });
  }

  carregarAtrasadas(): void {
    this.carregando = true;
    this.service.emAndamento(0, 100).subscribe({
      next: res => {
        const hoje = new Date();
        this.atrasadasList = res.content.filter(
          s => s.dataPrazo && new Date(s.dataPrazo) < hoje
        );
        this.totalPaginasAtrasadas = Math.ceil(this.atrasadasList.length / 20) || 1;
        this.primeiroAtrasadas = true;
        this.ultimoAtrasadas = this.totalPaginasAtrasadas <= 1;
        this.paginaAtrasadas = 0;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar solicitações'); this.carregando = false; }
    });
  }

  carregarRecusadas(pagina = 0): void {
    this.carregando = true;
    this.service.rejeitadas(pagina).subscribe({
      next: res => {
        this.recusadasList = res.content;
        this.paginaRecusadas = res.number;
        this.totalPaginasRecusadas = res.totalPages;
        this.primeiroRecusadas = res.first;
        this.ultimoRecusadas = res.last;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar solicitações'); this.carregando = false; }
    });
  }

  carregarFinalizadas(pagina = 0): void {
    this.carregando = true;
    this.service.finalizadas(pagina).subscribe({
      next: res => {
        this.finalizadasList = res.content;
        this.paginaFinalizadas = res.number;
        this.totalPaginasFinalizadas = res.totalPages;
        this.primeiroFinalizadas = res.first;
        this.ultimoFinalizadas = res.last;
        this.totalFinalizadas = res.totalElements;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar solicitações finalizadas'); this.carregando = false; }
    });
  }

  // ── Ações ────────────────────────────────────────────────────────────────

  verDetalhes(s: SolicitacaoResponse): void {
    this.router.navigate(['/dashboard/gestor/solicitacoes', s.id]);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  estaAtrasada(s: SolicitacaoResponse): boolean {
    if (!s.dataPrazo || s.status === 'FINALIZADA' || s.status === 'REJEITADA') return false;
    return new Date(s.dataPrazo) < new Date();
  }

  get atrasadasExibidas(): SolicitacaoResponse[] {
    const start = this.paginaAtrasadas * 20;
    return this.atrasadasList.slice(start, start + 20);
  }

  logout(): void { this.auth.logout(); }
}
