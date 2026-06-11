import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  SolicitacaoResponse,
  GestorAprovarRequest,
  GestorRejeitarRequest,
  RevealAnonimatoRequest
} from '../../../core/models/solicitacao.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LeafletMapComponent } from '../../../shared/components/leaflet-map/leaflet-map.component';

@Component({
  selector: 'app-detalhe-solicitacao',
  standalone: true,
  imports: [
    NgIf, NgFor, DatePipe, FormsModule,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, StatusBadgeComponent, LeafletMapComponent
  ],
  templateUrl: './detalhe-solicitacao.component.html',
  styleUrl: './detalhe-solicitacao.component.scss'
})
export class DetalheSolicitacaoComponent implements OnInit {

  nome = this.auth.getNomeUsuario() ?? 'Usuário';
  role = this.auth.getTipoUsuario();

  solicitacao: SolicitacaoResponse | null = null;
  carregando = true;
  erro: string | null = null;
  processando = false;

  showModalAprovar = false;
  showModalRejeitar = false;
  showModalReativar = false;
  aprovarDTO: GestorAprovarRequest = { prioridade: '', dataPrazo: '' };
  rejeitarDTO: GestorRejeitarRequest = { observacao: '' };

  showModalAnonimato = false;
  anonimatoDTO: RevealAnonimatoRequest = { senhaAdm: '', observacao: '' };

  get eGestor(): boolean { return this.role === 'GESTOR'; }
  get eAtendente(): boolean { return this.role === 'ATENDENTE'; }
  get eAdmin(): boolean { return this.role === 'ADMINISTRADOR'; }

  get motivoRejeicao(): string | undefined {
    return this.solicitacao?.historicos?.find(h => h.statusNovo === 'REJEITADA')?.observacao;
  }

  constructor(
    private auth: AuthService,
    private service: SolicitacaoService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.buscarPorId(id).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Solicitação não encontrada ou você não tem permissão para visualizá-la.';
        this.carregando = false;
      }
    });
  }

  estaAtrasada(): boolean {
    if (!this.solicitacao?.dataPrazo) return false;
    const s = this.solicitacao.status;
    if (s === 'FINALIZADA' || s === 'REJEITADA') return false;
    return new Date(this.solicitacao.dataPrazo) < new Date();
  }

  voltar(): void { this.location.back(); }

  abrirModalAprovar(): void {
    this.aprovarDTO = { prioridade: '', dataPrazo: '' };
    this.showModalAprovar = true;
  }

  confirmarAprovar(): void {
    if (!this.solicitacao || !this.aprovarDTO.prioridade || !this.aprovarDTO.dataPrazo) return;
    this.processando = true;
    this.service.aprovar(this.solicitacao.id, this.aprovarDTO).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.showModalAprovar = false;
        this.processando = false;
        this.toast.success('Solicitação aprovada!');
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao aprovar');
      }
    });
  }

  abrirModalRejeitar(): void {
    this.rejeitarDTO = { observacao: '' };
    this.showModalRejeitar = true;
  }

  confirmarRejeitar(): void {
    if (!this.solicitacao || !this.rejeitarDTO.observacao.trim()) return;
    this.processando = true;
    this.service.rejeitar(this.solicitacao.id, this.rejeitarDTO).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.showModalRejeitar = false;
        this.processando = false;
        this.toast.success('Solicitação rejeitada.');
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao rejeitar');
      }
    });
  }

  abrirModalReativar(): void { this.showModalReativar = true; }

  confirmarReativar(): void {
    if (!this.solicitacao) return;
    this.processando = true;
    this.service.reativar(this.solicitacao.id).subscribe({
      next: () => {
        this.showModalReativar = false;
        this.processando = false;
        this.toast.success('Solicitação reativada para nova análise.');
        this.router.navigate(['/dashboard/gestor'], { queryParams: { tab: 'recusadas' } });
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao reativar');
      }
    });
  }

  onPegar(): void {
    if (!this.solicitacao) return;
    this.service.pegar(this.solicitacao.id).subscribe({
      next: sol => { this.solicitacao = sol; this.toast.success('Solicitação assumida!'); },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao assumir')
    });
  }

  onFinalizar(): void {
    if (!this.solicitacao) return;
    this.service.finalizar(this.solicitacao.id).subscribe({
      next: sol => { this.solicitacao = sol; this.toast.success('Solicitação finalizada!'); },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao finalizar')
    });
  }

  onDesvincular(): void {
    if (!this.solicitacao) return;
    this.service.desvincular(this.solicitacao.id).subscribe({
      next: () => {
        this.toast.success('Desvinculado da solicitação.');
        this.voltar();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao desvincular')
    });
  }

  abrirModalAnonimato(): void {
    this.anonimatoDTO = { senhaAdm: '', observacao: '' };
    this.showModalAnonimato = true;
  }

  confirmarAnonimato(): void {
    if (!this.solicitacao) return;
    this.processando = true;
    this.service.revelarAnonimato(this.solicitacao.id, this.anonimatoDTO).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.showModalAnonimato = false;
        this.processando = false;
        this.toast.success('Identidade do solicitante revelada.');
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao revelar anonimato');
      }
    });
  }

  logout(): void { this.auth.logout(); }
}
