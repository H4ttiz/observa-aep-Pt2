import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { ToastService } from '../../../core/services/toast.service';
import { SolicitacaoResponse } from '../../../core/models/solicitacao.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { NavbarLateralComponent, NavItem } from '../../../shared/components/navbar-lateral/navbar-lateral.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PaginacaoComponent } from '../../../shared/components/paginacao/paginacao.component';
import { NovaSolicitacaoComponent } from '../../solicitacoes/nova/nova-solicitacao.component';

@Component({
  selector: 'app-dashboard-cidadao',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, PaginacaoComponent,
    NovaSolicitacaoComponent
  ],
  templateUrl: './dashboard-cidadao.component.html',
  styleUrl: './dashboard-cidadao.component.scss'
})
export class DashboardCidadaoComponent implements OnInit {
  nome = this.auth.getNomeUsuario() ?? 'Cidadão';
  activeTab = 'inicio';

  navItems: NavItem[] = [
    { id: 'inicio',           icon: 'home',       label: 'Início' },
    { id: 'nova-solicitacao', icon: 'edit_note',  label: 'Nova Solicitação' },
    { id: 'minhas',           icon: 'assignment', label: 'Minhas Solicitações' }
  ];

  minhasSolicitacoes: SolicitacaoResponse[] = [];
  carregando = false;

  paginaMinhas = 0;
  totalPaginasMinhas = 0;
  primeiroMinhas = true;
  ultimoMinhas = false;
  totalMinhas = 0;

  constructor(
    private auth: AuthService,
    private solicitacaoService: SolicitacaoService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarMinhas();
  }

  setTab(id: string): void {
    this.activeTab = id;
    if (id === 'minhas') this.carregarMinhas(0);
  }

  carregarMinhas(pagina = 0): void {
    this.carregando = true;
    this.solicitacaoService.minhas(pagina).subscribe({
      next: res => {
        this.minhasSolicitacoes = res.content;
        this.paginaMinhas = res.number;
        this.totalPaginasMinhas = res.totalPages;
        this.primeiroMinhas = res.first;
        this.ultimoMinhas = res.last;
        this.totalMinhas = res.totalElements;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar solicitações'); this.carregando = false; }
    });
  }

  onPaginaMinhasMudou(pagina: number): void {
    this.carregarMinhas(pagina);
    document.getElementById('minhas-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  verDetalhes(s: SolicitacaoResponse): void {
    this.router.navigate(['/dashboard/cidadao/solicitacoes', s.id]);
  }

  onSolicitacaoCriada(s: SolicitacaoResponse): void {
    this.activeTab = 'minhas';
    this.carregarMinhas(0);
  }

  estaAtrasada(s: SolicitacaoResponse): boolean {
    if (!s.dataPrazo || s.status === 'FINALIZADA' || s.status === 'REJEITADA') return false;
    return new Date(s.dataPrazo) < new Date();
  }

  logout(): void { this.auth.logout(); }
}
