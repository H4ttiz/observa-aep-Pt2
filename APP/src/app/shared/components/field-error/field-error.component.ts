import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  standalone: true,
  imports: [NgIf],
  template: `
    <span *ngIf="show" class="field-error-msg">{{ message }}</span>
  `,
  styles: [`
    .field-error-msg {
      display: block;
      color: #EF4444;
      font-size: 0.75rem;
      margin-top: 4px;
      line-height: 1.4;
    }
  `]
})
export class FieldErrorComponent {
  @Input() errors: ValidationErrors | null = null;
  @Input() touched: boolean | null = false;
  @Input() dirty: boolean | null = false;
  @Input() submitted = false;

  get show(): boolean {
    return (this.touched || this.dirty || this.submitted) && !!this.errors;
  }

  get message(): string {
    if (!this.errors) return '';
    if (this.errors['required'])         return 'Este campo é obrigatório.';
    if (this.errors['email'])            return 'Informe um e-mail válido.';
    if (this.errors['minlength'])        return `Mínimo de ${this.errors['minlength'].requiredLength} caracteres.`;
    if (this.errors['maxlength'])        return `Máximo de ${this.errors['maxlength'].requiredLength} caracteres.`;
    if (this.errors['cpfInvalido'])      return 'CPF inválido.';
    if (this.errors['senhaNaoCoincidem'])return 'As senhas não coincidem.';
    return 'Valor inválido.';
  }
}
