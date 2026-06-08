import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { Solicitacao } from '../../../core/models/solicitacao.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { NavbarLateralComponent, NavItem } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SolicitacaoDetalhesComponent } from '../../../shared/components/solicitacao-detalhes/solicitacao-detalhes.component';
import { MOCK_SOLICITACOES } from '../../../shared/mock-data/mock-data';

@Component({
  selector: 'app-dashboard-atendente',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, SolicitacaoDetalhesComponent
  ],
  templateUrl: './dashboard-atendente.component.html',
  styleUrl: './dashboard-atendente.component.scss'
})
export class DashboardAtendenteComponent {
  nome = this.auth.getNomeUsuario() ?? 'Atendente';
  activeTab = 'inicio';

  navItems: NavItem[] = [
    { id: 'inicio',  icon: 'home',          label: 'Início' },
    { id: 'fila',    icon: 'inbox',         label: 'Fila de Atendimento' },
    { id: 'minhas',  icon: 'assignment',    label: 'Minhas Solicitações' }
  ];

  // TODO: mock — aguardando endpoint GET /solicitacoes
  filaAtendimento: Solicitacao[] = MOCK_SOLICITACOES.filter(s =>
    ['APROVADA', 'AGUARDANDO_ATENDENTE'].includes(s.status)
  );

  // TODO: mock — aguardando endpoint GET /solicitacoes
  minhasSolicitacoes: Solicitacao[] = MOCK_SOLICITACOES.filter(s =>
    s.atendente?.nome === 'Mariana Costa' || s.atendente?.nome === 'João Pereira'
  );

  selectedSolicitacao: Solicitacao | null = null;

  get totalAguardando(): number { return this.filaAtendimento.filter(s => s.status === 'AGUARDANDO_ATENDENTE').length; }
  get totalEmAndamento(): number { return this.minhasSolicitacoes.filter(s => s.status === 'EM_ANDAMENTO').length; }
  get totalFinalizadas(): number { return this.minhasSolicitacoes.filter(s => s.status === 'FINALIZADA').length; }

  constructor(private auth: AuthService) {}

  setTab(id: string): void { this.activeTab = id; }
  verDetalhes(s: Solicitacao): void { this.selectedSolicitacao = s; }

  onPuxarAtendimento(): void {
    alert('Em breve: integração com o backend');
  }

  logout(): void { this.auth.logout(); }
}
