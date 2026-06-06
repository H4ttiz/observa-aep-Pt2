import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Solicitacao } from '../../../core/models/solicitacao.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { NavbarLateralComponent, NavItem } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SolicitacaoDetalhesComponent } from '../../../shared/components/solicitacao-detalhes/solicitacao-detalhes.component';
import { MOCK_SOLICITACOES } from '../../../shared/mock-data/mock-data';

@Component({
  selector: 'app-dashboard-cidadao',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, SolicitacaoDetalhesComponent
  ],
  templateUrl: './dashboard-cidadao.component.html',
  styleUrl: './dashboard-cidadao.component.scss'
})
export class DashboardCidadaoComponent {
  nome = this.auth.getNomeUsuario() ?? 'Cidadão';
  activeTab = 'inicio';

  navItems: NavItem[] = [
    { id: 'inicio',           icon: 'home',              label: 'Início' },
    { id: 'nova-solicitacao', icon: 'edit_note',         label: 'Nova Solicitação' },
    { id: 'minhas',           icon: 'assignment',        label: 'Minhas Solicitações' }
  ];

  // TODO: substituir mock por this.http.get<Solicitacao[]>('/api/solicitacoes/minhas')
  minhasSolicitacoes: Solicitacao[] = MOCK_SOLICITACOES.filter(s => !s.anonimo && s.solicitante?.nome === 'Carlos Mendes');

  selectedSolicitacao: Solicitacao | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  setTab(id: string): void { this.activeTab = id; }

  verDetalhes(s: Solicitacao): void { this.selectedSolicitacao = s; }

  onEnviarSolicitacao(): void {
    alert('Em breve: integração com o backend');
  }

  logout(): void { this.auth.logout(); }
}
