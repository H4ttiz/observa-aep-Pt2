import { Component, Input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() prioridade = '';
  @Input() tipoLog = '';

  get statusLabel(): string {
    const map: Record<string, string> = {
      AGUARDANDO_APROVACAO: 'Ag. Aprovação',
      APROVADA:             'Aprovada',
      AGUARDANDO_ATENDENTE: 'Ag. Atendente',
      EM_ANDAMENTO:         'Em Andamento',
      FINALIZADA:           'Finalizada',
      REJEITADA:            'Rejeitada'
    };
    return map[this.status] ?? this.status;
  }

  get prioridadeLabel(): string {
    const map: Record<string, string> = {
      BAIXA:   'Baixa',
      MEDIA:   'Média',
      ALTA:    'Alta',
      URGENTE: 'Urgente'
    };
    return map[this.prioridade] ?? this.prioridade;
  }

  get tipoLogLabel(): string {
    const map: Record<string, string> = {
      CRIACAO:       'Criação',
      ALTERACAO:     'Alteração',
      EXCLUSAO:      'Exclusão',
      LOGIN:         'Login',
      ACESSO_NEGADO: 'Acesso Negado'
    };
    return map[this.tipoLog] ?? this.tipoLog;
  }
}
