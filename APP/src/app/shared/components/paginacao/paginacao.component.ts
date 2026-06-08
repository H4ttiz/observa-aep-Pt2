import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './paginacao.component.html',
  styleUrl: './paginacao.component.scss'
})
export class PaginacaoComponent implements OnChanges {
  @Input() paginaAtual = 0;
  @Input() totalPaginas = 0;
  @Input() primeiro = true;
  @Input() ultimo = false;
  @Output() paginaMudou = new EventEmitter<number>();

  paginas: (number | '...')[] = [];

  ngOnChanges(): void { this.calcularPaginas(); }

  private calcularPaginas(): void {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;
    if (total <= 1) { this.paginas = []; return; }

    const set = new Set<number>();
    set.add(0);
    set.add(total - 1);
    set.add(atual);
    if (atual > 0)         set.add(atual - 1);
    if (atual < total - 1) set.add(atual + 1);

    const sorted = Array.from(set).sort((a, b) => a - b);
    const result: (number | '...')[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
      result.push(sorted[i]);
    }
    this.paginas = result;
  }

  ir(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas || pagina === this.paginaAtual) return;
    this.paginaMudou.emit(pagina);
  }

  anterior(): void { if (!this.primeiro) this.ir(this.paginaAtual - 1); }
  proximo():  void { if (!this.ultimo)   this.ir(this.paginaAtual + 1); }

  isNumber(v: number | '...'): v is number { return typeof v === 'number'; }
}
