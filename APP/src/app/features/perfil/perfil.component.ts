import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { ToastService } from '../../core/services/toast.service';
import { NavbarTopComponent } from '../../shared/components/navbar-top/navbar-top.component';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';
import { FieldErrorComponent } from '../../shared/components/field-error/field-error.component';
import { EnderecoUsuarioFormComponent } from '../../shared/components/endereco-usuario-form/endereco-usuario-form.component';
import { Usuario, UsuarioSelfUpdateRequest } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    NgIf, FormsModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    NavbarTopComponent, PasswordInputComponent, FieldErrorComponent,
    EnderecoUsuarioFormComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  @ViewChild(EnderecoUsuarioFormComponent) enderecoForm?: EnderecoUsuarioFormComponent;

  nome = this.auth.getNomeUsuario() ?? '';

  usuario: Usuario | null = null;
  carregando = true;
  salvando = false;
  submitted = false;

  form: UsuarioSelfUpdateRequest = {};

  alterandoSenha = false;
  enderecoExpandido = false;

  fotoPreview: string | null = null;
  fotoFile: File | null = null;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioService.buscarPerfil().subscribe({
      next: u => {
        this.usuario = u;
        this.form = { nome: u.nome, celular: u.celular ?? '' };
        this.auth.setFotoPerfil(u.fotoPerfil ?? null);
        this.carregando = false;
      },
      error: () => {
        this.toast.error('Erro ao carregar perfil');
        this.carregando = false;
      }
    });
  }

  onFotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.fotoFile = file;
    const reader = new FileReader();
    reader.onload = e => { this.fotoPreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  salvarFoto(): void {
    if (!this.fotoFile) return;
    this.salvando = true;
    this.usuarioService.atualizarFoto(this.fotoFile).subscribe({
      next: u => {
        this.usuario = u;
        this.auth.setFotoPerfil(u.fotoPerfil ?? null);
        this.fotoFile = null;
        this.fotoPreview = null;
        this.salvando = false;
        this.toast.success('Foto atualizada com sucesso!');
      },
      error: err => {
        this.salvando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao salvar foto');
      }
    });
  }

  salvarDados(formRef: any): void {
    this.submitted = true;
    this.enderecoForm?.markAllAsTouched();

    if (formRef.invalid) return;

    const payload: UsuarioSelfUpdateRequest = {
      nome:    this.form.nome,
      celular: this.form.celular
    };

    if (this.alterandoSenha) {
      payload.senhaAtual          = this.form.senhaAtual;
      payload.novaSenha           = this.form.novaSenha;
      payload.confirmarNovaSenha  = this.form.confirmarNovaSenha;
    }

    if (this.enderecoForm) {
      payload.enderecoUsuario = this.enderecoForm.value;
    }

    this.salvando = true;
    this.usuarioService.atualizarSelf(payload).subscribe({
      next: u => {
        this.usuario = u;
        this.salvando = false;
        this.submitted = false;
        this.alterandoSenha = false;
        this.form.senhaAtual = '';
        this.form.novaSenha = '';
        this.form.confirmarNovaSenha = '';
        this.toast.success('Perfil atualizado com sucesso!');
      },
      error: err => {
        this.salvando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao atualizar perfil');
      }
    });
  }

  cancelarSenha(): void {
    this.alterandoSenha = false;
    this.form.senhaAtual = '';
    this.form.novaSenha = '';
    this.form.confirmarNovaSenha = '';
  }

  voltar(): void { this.router.navigate(['/dashboard']); }

  logout(): void { this.auth.logout(); }
}
