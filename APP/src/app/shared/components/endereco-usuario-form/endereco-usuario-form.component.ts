import {
  Component, DestroyRef, ElementRef, Input,
  OnChanges, OnInit, SimpleChanges, ViewChild, inject
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EnderecoUsuario, EnderecoUsuarioRequest } from '../../../core/models/endereco.model';
import { CepService } from '../../../core/services/cep.service';

@Component({
  selector: 'app-endereco-usuario-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './endereco-usuario-form.component.html',
  styleUrl: './endereco-usuario-form.component.scss'
})
export class EnderecoUsuarioFormComponent implements OnInit, OnChanges {

  @Input() enderecoInicial: EnderecoUsuario | null = null;
  @Input() submitted = false;
  @ViewChild('numeroInput') numeroInput?: ElementRef<HTMLInputElement>;

  private fb         = inject(FormBuilder);
  private cepService = inject(CepService);
  private destroyRef = inject(DestroyRef);

  buscandoCep  = false;
  erroCep      = false;
  autoPreenchido = false;

  readonly ufs = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO',
    'MA','MT','MS','MG','PA','PB','PR','PE','PI',
    'RJ','RN','RS','RO','RR','SC','SP','SE','TO'
  ];

  form: FormGroup = this.fb.group({
    cep:         ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
    logradouro:  ['', [Validators.required, Validators.maxLength(255)]],
    numero:      ['', [Validators.required, Validators.maxLength(20)]],
    complemento: [''],
    bairro:      ['', [Validators.required, Validators.maxLength(100)]],
    cidade:      ['', [Validators.required, Validators.maxLength(100)]],
    estado:      ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
  });

  ngOnInit(): void {
    this.form.get('cep')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => {
      const digits = (val ?? '').replace(/\D/g, '');
      this.erroCep = false;
      if (digits.length === 8) {
        this.buscarCep(digits);
      } else if (this.autoPreenchido) {
        this.limparAutoPreenchimento();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enderecoInicial'] && this.enderecoInicial) {
      const e = this.enderecoInicial;
      this.form.patchValue({
        cep:         e.cep ?? '',
        logradouro:  e.logradouro ?? '',
        numero:      e.numero ?? '',
        complemento: e.complemento ?? '',
        bairro:      e.bairro ?? '',
        cidade:      e.cidade ?? '',
        estado:      e.estado ?? ''
      }, { emitEvent: false });
    }
  }

  get valid(): boolean { return this.form.valid; }

  get value(): EnderecoUsuarioRequest {
    const v = this.form.getRawValue();
    return {
      cep:         v.cep.replace(/\D/g, ''),
      logradouro:  v.logradouro.trim(),
      numero:      v.numero.trim(),
      complemento: v.complemento?.trim() || undefined,
      bairro:      v.bairro.trim(),
      cidade:      v.cidade.trim(),
      estado:      v.estado.toUpperCase().trim()
    };
  }

  markAllAsTouched(): void { this.form.markAllAsTouched(); }

  onCepInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    let v = el.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
    this.form.get('cep')!.setValue(v);
    el.value = v;
  }

  private buscarCep(digits: string): void {
    this.buscandoCep = true;
    this.erroCep = false;
    this.cepService.buscarPorCep(digits).subscribe({
      next: res => {
        this.buscandoCep = false;
        this.autoPreenchido = true;
        this.form.patchValue({
          logradouro: res.logradouro ?? '',
          bairro:     res.bairro    ?? '',
          cidade:     res.cidade    ?? '',
          estado:     res.estado    ?? ''
        });
        this.form.get('logradouro')!.disable();
        this.form.get('bairro')!.disable();
        this.form.get('cidade')!.disable();
        this.form.get('estado')!.disable();
        setTimeout(() => this.numeroInput?.nativeElement.focus(), 50);
      },
      error: err => {
        this.buscandoCep = false;
        if (err.status === 404) {
          this.erroCep = true;
        }
        this.limparAutoPreenchimento();
      }
    });
  }

  private limparAutoPreenchimento(): void {
    this.autoPreenchido = false;
    this.form.get('logradouro')!.enable();
    this.form.get('bairro')!.enable();
    this.form.get('cidade')!.enable();
    this.form.get('estado')!.enable();
  }

  err(field: string): string | null {
    const c = this.form.get(field);
    if (!c || (!c.touched && !this.submitted) || !c.errors) return null;
    if (c.errors['required'])   return 'Este campo é obrigatório.';
    if (c.errors['pattern'])    return 'CEP inválido.';
    if (c.errors['minlength'])  return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    if (c.errors['maxlength'])  return `Máximo ${c.errors['maxlength'].requiredLength} caracteres.`;
    return 'Valor inválido.';
  }
}
