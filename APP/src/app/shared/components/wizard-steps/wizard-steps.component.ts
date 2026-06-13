import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wizard-steps',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, MatIconModule],
  templateUrl: './wizard-steps.component.html',
  styleUrl: './wizard-steps.component.scss'
})
export class WizardStepsComponent {
  /** Rótulos das etapas, na ordem de exibição */
  @Input() steps: string[] = [];
  /** Etapa atual, baseada em 1 */
  @Input() current = 1;

  stateOf(index: number): 'done' | 'current' | 'future' {
    const step = index + 1;
    if (step < this.current) return 'done';
    if (step === this.current) return 'current';
    return 'future';
  }
}
