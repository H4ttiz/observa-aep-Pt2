import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SolicitacaoResponse } from '../../../core/models/solicitacao.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';

@Component({
  selector: 'app-solicitacao-detalhes',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, MatIconModule, MatButtonModule, StatusBadgeComponent, LeafletMapComponent],
  templateUrl: './solicitacao-detalhes.component.html',
  styleUrl: './solicitacao-detalhes.component.scss'
})
export class SolicitacaoDetalhesComponent {
  @Input() solicitacao: SolicitacaoResponse | null = null;
  @Input() mostrarDadosSolicitante = false;
  @Output() fechar = new EventEmitter<void>();

  estaAtrasada(): boolean {
    if (!this.solicitacao?.dataPrazo) return false;
    const s = this.solicitacao.status;
    if (s === 'FINALIZADA' || s === 'REJEITADA') return false;
    return new Date(this.solicitacao.dataPrazo) < new Date();
  }

  get motivoRejeicao(): string | undefined {
    return this.solicitacao?.historicos
      ?.find(h => h.statusNovo === 'REJEITADA')?.observacao;
  }
}
