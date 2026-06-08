import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { Solicitacao } from '../../../core/models/solicitacao.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { NavbarLateralComponent, NavItem } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SolicitacaoDetalhesComponent } from '../../../shared/components/solicitacao-detalhes/solicitacao-detalhes.component';
import { PaginacaoComponent } from '../../../shared/components/paginacao/paginacao.component';
import { MOCK_SOLICITACOES } from '../../../shared/mock-data/mock-data';

@Component({
  selector: 'app-dashboard-gestor',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe, FormsModule,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, SolicitacaoDetalhesComponent, PaginacaoComponent
  ],
  templateUrl: './dashboard-gestor.component.html',
  styleUrl: './dashboard-gestor.component.scss'
})
export class DashboardGestorComponent {
  nome = this.auth.getNomeUsuario() ?? 'Gestor';
  activeTab = 'inicio';
  filtroStatus = '';

  navItems: NavItem[] = [
    { id: 'inicio',        icon: 'home',              label: 'Início' },
    { id: 'aprovacao',     icon: 'pending_actions',   label: 'Ag. Aprovação' },
    { id: 'andamento',     icon: 'sync',              label: 'Em Andamento' },
    { id: 'movimentacao',  icon: 'swap_horiz',        label: 'Movimentação Geral' },
    { id: 'atrasadas',     icon: 'alarm_off',         label: 'Atrasadas' },
    { id: 'recusadas',     icon: 'cancel',            label: 'Recusadas' },
    { id: 'relatorio',     icon: 'bar_chart',         label: 'Relatório' }
  ];

  // TODO: mock — aguardando endpoint GET /solicitacoes
  aguardandoAprovacao: Solicitacao[] = MOCK_SOLICITACOES.filter(s => s.status === 'AGUARDANDO_APROVACAO');
  emAndamento:         Solicitacao[] = MOCK_SOLICITACOES.filter(s => s.status === 'EM_ANDAMENTO');
  todasSolicitacoes:   Solicitacao[] = MOCK_SOLICITACOES;
  atrasadas:           Solicitacao[] = MOCK_SOLICITACOES.filter(s => s.atrasada);
  recusadas:           Solicitacao[] = MOCK_SOLICITACOES.filter(s => s.status === 'REJEITADA');

  selectedSolicitacao: Solicitacao | null = null;

  // Paginação — estado único por tab (reseta ao trocar de aba ou filtro)
  readonly pageSizeSolicits = 20;
  paginaSolicits = 0;

  private get listaAtiva(): Solicitacao[] {
    switch (this.activeTab) {
      case 'aprovacao':    return this.aguardandoAprovacao;
      case 'andamento':    return this.emAndamento;
      case 'movimentacao': return this.solicitacoesFiltradas;
      case 'atrasadas':    return this.atrasadas;
      case 'recusadas':    return this.recusadas;
      default:             return [];
    }
  }

  private paginar(lista: Solicitacao[]): Solicitacao[] {
    const start = this.paginaSolicits * this.pageSizeSolicits;
    return lista.slice(start, start + this.pageSizeSolicits);
  }

  get totalPaginasSolicits(): number { return Math.ceil(this.listaAtiva.length / this.pageSizeSolicits) || 1; }
  get primeiroSolicits(): boolean    { return this.paginaSolicits === 0; }
  get ultimoSolicits(): boolean      { return this.paginaSolicits >= this.totalPaginasSolicits - 1; }

  get aguardandoAprovacaoExibidos(): Solicitacao[] { return this.paginar(this.aguardandoAprovacao); }
  get emAndamentoExibidos(): Solicitacao[]         { return this.paginar(this.emAndamento); }
  get solicitacoesFiltradasExibidas(): Solicitacao[] { return this.paginar(this.solicitacoesFiltradas); }
  get atrasadasExibidas(): Solicitacao[]           { return this.paginar(this.atrasadas); }
  get recusadasExibidas(): Solicitacao[]           { return this.paginar(this.recusadas); }

  get statusOptions(): string[] {
    return ['', 'AGUARDANDO_APROVACAO', 'APROVADA', 'AGUARDANDO_ATENDENTE', 'EM_ANDAMENTO', 'FINALIZADA', 'REJEITADA'];
  }

  get solicitacoesFiltradas(): Solicitacao[] {
    if (!this.filtroStatus) return this.todasSolicitacoes;
    return this.todasSolicitacoes.filter(s => s.status === this.filtroStatus);
  }

  get chartData(): { name: string; value: number; color: string }[] {
    const finalizadas  = this.todasSolicitacoes.filter(s => s.status === 'FINALIZADA').length;
    const emAndamento  = this.todasSolicitacoes.filter(s => s.status === 'EM_ANDAMENTO').length;
    const recusadas    = this.todasSolicitacoes.filter(s => s.status === 'REJEITADA').length;
    const atrasadas    = this.todasSolicitacoes.filter(s => s.atrasada).length;
    const aguardando   = this.todasSolicitacoes.filter(s => s.status === 'AGUARDANDO_APROVACAO').length;
    return [
      { name: 'Finalizadas',  value: finalizadas, color: '#059669' },
      { name: 'Em Andamento', value: emAndamento, color: '#0D9488' },
      { name: 'Recusadas',    value: recusadas,   color: '#DC2626' },
      { name: 'Atrasadas',    value: atrasadas,   color: '#EA580C' },
      { name: 'Ag. Aprovação',value: aguardando,  color: '#D97706' }
    ];
  }

  get chartMax(): number {
    return Math.max(...this.chartData.map(d => d.value), 1);
  }

  get totalStats() {
    return {
      aguardandoAprovacao: this.aguardandoAprovacao.length,
      emAndamento:         this.emAndamento.length,
      finalizadas:         this.todasSolicitacoes.filter(s => s.status === 'FINALIZADA').length,
      rejeitadas:          this.recusadas.length,
      atrasadas:           this.atrasadas.length
    };
  }

  constructor(private auth: AuthService) {}

  setTab(id: string): void {
    this.activeTab = id;
    this.paginaSolicits = 0;
  }

  verDetalhes(s: Solicitacao): void { this.selectedSolicitacao = s; }

  onFiltroStatusChange(): void { this.paginaSolicits = 0; }

  onPaginaSolicitsMudou(pagina: number): void {
    this.paginaSolicits = pagina;
    document.querySelector('.content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAprovar():  void { alert('Em breve: integração com o backend'); }
  onRejeitar(): void { alert('Em breve: integração com o backend'); }

  logout(): void { this.auth.logout(); }
}
