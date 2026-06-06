import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [NgIf, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss'
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() autocomplete = 'off';

  value = '';
  visible = false;
  isDisabled = false;

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(v: string): void { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled = d; }

  onInput(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this._onChange(this.value);
  }

  onBlur(): void { this._onTouched(); }

  toggle(): void { this.visible = !this.visible; }
}
