import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Solicitacao } from '../../../core/models/solicitacao.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-solicitacao-detalhes',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, MatIconModule, MatButtonModule, StatusBadgeComponent],
  templateUrl: './solicitacao-detalhes.component.html',
  styleUrl: './solicitacao-detalhes.component.scss'
})
export class SolicitacaoDetalhesComponent {
  @Input() solicitacao: Solicitacao | null = null;
  @Input() mostrarDadosSolicitante = false;
  @Output() fechar = new EventEmitter<void>();
}
