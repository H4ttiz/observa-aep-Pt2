import { Component, Input, OnChanges } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HistoricoResponse } from '../../../core/models/historico.model';

type StepState = 'done' | 'current' | 'future' | 'rejected';

interface TimelineNode {
  key: string;
  label: string;
  state: StepState;
  date?: string;
}

const SEQUENCE = ['AGUARDANDO_APROVACAO', 'APROVADA', 'AGUARDANDO_ATENDENTE', 'EM_ANDAMENTO', 'FINALIZADA'];

const LABELS: Record<string, string> = {
  AGUARDANDO_APROVACAO: 'Aguardando Aprovação',
  APROVADA: 'Aprovada',
  AGUARDANDO_ATENDENTE: 'Aguardando Atendente',
  EM_ANDAMENTO: 'Em Andamento',
  FINALIZADA: 'Finalizada',
  REJEITADA: 'Rejeitada'
};

@Component({
  selector: 'app-status-timeline',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, MatIconModule],
  templateUrl: './status-timeline.component.html',
  styleUrl: './status-timeline.component.scss'
})
export class StatusTimelineComponent implements OnChanges {
  @Input() historicos: HistoricoResponse[] = [];
  @Input() statusAtual = '';

  nodes: TimelineNode[] = [];

  ngOnChanges(): void {
    this.nodes = this.buildNodes();
  }

  private dataPara(status: string): string | undefined {
    return this.historicos.find(h => h.statusNovo === status)?.dataAlteracao;
  }

  private buildNodes(): TimelineNode[] {
    if (this.statusAtual === 'REJEITADA') {
      const rejeicao = this.historicos.find(h => h.statusNovo === 'REJEITADA');
      const idxAnterior = rejeicao?.statusAnterior ? SEQUENCE.indexOf(rejeicao.statusAnterior) : -1;

      const nodes: TimelineNode[] = SEQUENCE.slice(0, idxAnterior + 1).map(key => ({
        key,
        label: LABELS[key],
        state: 'done' as StepState,
        date: this.dataPara(key)
      }));

      nodes.push({
        key: 'REJEITADA',
        label: LABELS['REJEITADA'],
        state: 'rejected',
        date: rejeicao?.dataAlteracao
      });

      return nodes;
    }

    const currentIndex = SEQUENCE.indexOf(this.statusAtual);
    const isFinal = this.statusAtual === 'FINALIZADA';

    return SEQUENCE.map((key, i) => {
      let state: StepState;
      if (isFinal || i < currentIndex) {
        state = 'done';
      } else if (i === currentIndex) {
        state = 'current';
      } else {
        state = 'future';
      }
      return { key, label: LABELS[key], state, date: this.dataPara(key) };
    });
  }
}
