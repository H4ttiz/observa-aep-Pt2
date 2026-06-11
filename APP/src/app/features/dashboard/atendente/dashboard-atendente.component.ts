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
  selector: 'app-dashboard-atendente',
  standalone: true,
  imports: [
    NgIf, NgFor, NgClass, DatePipe,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, NavbarLateralComponent,
    StatusBadgeComponent, PaginacaoComponent
  ],
  templateUrl: './dashboard-atendente.component.html',
  styleUrl: './dashboard-atendente.component.scss'
})
export class DashboardAtendenteComponent implements OnInit {
  nome = this.auth.getNomeUsuario() ?? 'Atendente';
  activeTab = 'inicio';

  navItems: NavItem[] = [
    { id: 'inicio',      icon: 'home',          label: 'Início' },
    { id: 'fila',        icon: 'inbox',         label: 'Fila de Atendimento' },
    { id: 'minhas',      icon: 'assignment',    label: 'Minhas Solicitações' },
    { id: 'finalizadas', icon: 'check_circle',  label: 'Finalizadas por Mim' }
  ];

  filaAtendimento: SolicitacaoResponse[] = [];
  minhasSolicitacoes: SolicitacaoResponse[] = [];
  finalizadasList: SolicitacaoResponse[] = [];
  carregando = false;

  paginaFila = 0; totalPaginasFila = 0; primeiroFila = true; ultimoFila = false; totalFila = 0;
  paginaMinhas = 0; totalPaginasMinhas = 0; primeiroMinhas = true; ultimoMinhas = false; totalMinhasAndamento = 0;
  paginaFinalizadas = 0; totalPaginasFinalizadas = 0; primeiroFinalizadas = true; ultimoFinalizadas = false; totalFinalizadas = 0;

  constructor(
    private auth: AuthService,
    private service: SolicitacaoService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarFila();
    this.carregarMinhas();
    this.carregarTotalFinalizadas();
  }

  private carregarTotalFinalizadas(): void {
    this.service.finalizadasPorMim(0, 1).subscribe({
      next: r => this.totalFinalizadas = r.totalElements,
      error: () => {}
    });
  }

  setTab(id: string): void {
    this.activeTab = id;
    if (id === 'fila')        this.carregarFila(0);
    if (id === 'minhas')      this.carregarMinhas(0);
    if (id === 'finalizadas') this.carregarFinalizadas(0);
  }

  carregarFila(pagina = 0): void {
    this.carregando = true;
    this.service.fila(pagina).subscribe({
      next: res => {
        this.filaAtendimento = res.content;
        this.paginaFila = res.number;
        this.totalPaginasFila = res.totalPages;
        this.primeiroFila = res.first;
        this.ultimoFila = res.last;
        this.totalFila = res.totalElements;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar fila'); this.carregando = false; }
    });
  }

  carregarMinhas(pagina = 0): void {
    this.carregando = true;
    this.service.emAndamento(pagina).subscribe({
      next: res => {
        this.minhasSolicitacoes = res.content;
        this.paginaMinhas = res.number;
        this.totalPaginasMinhas = res.totalPages;
        this.primeiroMinhas = res.first;
        this.ultimoMinhas = res.last;
        this.totalMinhasAndamento = res.content.filter(s => s.status === 'EM_ANDAMENTO').length;
        this.carregando = false;
      },
      error: () => { this.toast.error('Erro ao carregar solicitações'); this.carregando = false; }
    });
  }

  carregarFinalizadas(pagina = 0): void {
    this.carregando = true;
    this.service.finalizadasPorMim(pagina).subscribe({
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

  verDetalhes(s: SolicitacaoResponse): void {
    this.router.navigate(['/dashboard/atendente/solicitacoes', s.id]);
  }

  estaAtrasada(s: SolicitacaoResponse): boolean {
    if (!s.dataPrazo || s.status === 'FINALIZADA') return false;
    return new Date(s.dataPrazo) < new Date();
  }

  get totalAguardando(): number { return this.totalFila; }
  get totalEmAndamento(): number { return this.totalMinhasAndamento; }
  get totalConcluidas(): number { return this.totalFinalizadas; }

  logout(): void { this.auth.logout(); }
}
