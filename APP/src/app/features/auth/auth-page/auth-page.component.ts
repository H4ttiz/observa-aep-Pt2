import { Component, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { CadastroRequest, LoginRequest } from '../../../core/models/auth.model';
import { EnderecoUsuarioFormComponent } from '../../../shared/components/endereco-usuario-form/endereco-usuario-form.component';
import { WizardStepsComponent } from '../../../shared/components/wizard-steps/wizard-steps.component';

function cpfValidator(ctrl: AbstractControl): ValidationErrors | null {
  const raw = (ctrl.value ?? '').replace(/\D/g, '');
  if (raw.length !== 11 || /^(\d)\1{10}$/.test(raw)) return { cpfInvalido: true };
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += +raw[i] * (10 - i);
  let rem = sum % 11;
  if (+raw[9] !== (rem < 2 ? 0 : 11 - rem)) return { cpfInvalido: true };
  sum = 0;
  for (let i = 0; i < 10; i++) sum += +raw[i] * (11 - i);
  rem = sum % 11;
  return +raw[10] !== (rem < 2 ? 0 : 11 - rem) ? { cpfInvalido: true } : null;
}

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    EnderecoUsuarioFormComponent,
    WizardStepsComponent
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent implements OnInit {
  @ViewChild(EnderecoUsuarioFormComponent) enderecoForm?: EnderecoUsuarioFormComponent;

  isLogin = true;
  isLoading = false;
  showSenhaLogin = false;
  showSenhaCadastro = false;
  cadastroSubmitted = false;
  cadastroStep: 1 | 2 = 1;

  loginForm!: FormGroup;
  cadastroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

    this.cadastroForm = this.fb.group({
      nome:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      senha:   ['', [Validators.required, Validators.minLength(6)]],
      cpf:     ['', [Validators.required, cpfValidator]],
      celular: ['']
    });
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.loginForm.reset();
    this.cadastroForm.reset();
    this.cadastroSubmitted = false;
    this.cadastroStep = 1;
    this.isLoading = false;
  }

  irParaEtapa2(): void {
    const camposEtapa1 = ['nome', 'email', 'senha', 'cpf', 'celular'];
    let valido = true;
    camposEtapa1.forEach(campo => {
      const ctrl = this.cadastroForm.get(campo);
      ctrl?.markAsTouched();
      if (ctrl?.invalid) valido = false;
    });
    if (valido) this.cadastroStep = 2;
  }

  voltarEtapa1(): void {
    this.cadastroStep = 1;
  }

  aplicarMascaraCpf(event: Event): void {
    const el = event.target as HTMLInputElement;
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    v = v
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    this.cadastroForm.get('cpf')!.setValue(v, { emitEvent: false });
    el.value = v;
  }

  aplicarMascaraCelular(event: Event): void {
    const el = event.target as HTMLInputElement;
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    this.cadastroForm.get('celular')!.setValue(v, { emitEvent: false });
    el.value = v;
  }

  onLogin(): void {
    if (this.loginForm.invalid || this.isLoading) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.loginForm.disable();

    const payload: LoginRequest = this.loginForm.getRawValue();

    this.authService.login(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.isLoading = false;
        this.loginForm.enable();
        const msg = err?.error?.erro ?? 'Credenciais inválidas. Verifique seu email e senha.';
        this.snack(msg, 'snack-error');
      }
    });
  }

  onCadastro(): void {
    this.cadastroSubmitted = true;
    this.enderecoForm?.markAllAsTouched();

    if (this.cadastroForm.invalid || !this.enderecoForm?.valid || this.isLoading) {
      this.cadastroForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.cadastroForm.disable();

    const raw = this.cadastroForm.getRawValue();
    const payload: CadastroRequest = {
      nome:             raw.nome.trim(),
      email:            raw.email.trim().toLowerCase(),
      senha:            raw.senha,
      cpf:              raw.cpf.replace(/\D/g, ''),
      celular:          raw.celular?.replace(/\D/g, '') || null,
      enderecoUsuario:  this.enderecoForm!.value
    };

    this.authService.cadastrar(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.cadastroForm.enable();
        this.cadastroSubmitted = false;
        this.snack('Conta criada com sucesso! Faça login para continuar.', 'snack-success');
        this.toggleMode();
      },
      error: (err) => {
        this.isLoading = false;
        this.cadastroForm.enable();
        const msg = err?.error?.erro ?? 'Erro ao criar conta. Verifique os dados.';
        this.snack(msg, 'snack-error');
      }
    });
  }

  loginErr(field: string): string {
    const c = this.loginForm.get(field);
    if (!c?.touched || !c.errors) return '';
    if (c.errors['required']) return 'Campo obrigatório';
    if (c.errors['email'])    return 'Email inválido';
    return '';
  }

  cadastroErr(field: string): string {
    const c = this.cadastroForm.get(field);
    if (!c?.touched || !c.errors) return '';
    if (c.errors['required'])   return 'Campo obrigatório';
    if (c.errors['email'])      return 'Email inválido';
    if (c.errors['minlength'])  return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    if (c.errors['cpfInvalido']) return 'CPF inválido';
    return '';
  }

  private snack(msg: string, cls: string): void {
    this.snackBar.open(msg, 'Fechar', {
      duration: 4500,
      panelClass: [cls],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
