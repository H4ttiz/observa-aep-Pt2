import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ToastService } from '../../../../core/services/toast.service';
import { NavbarTopComponent } from '../../../../shared/components/navbar-top/navbar-top.component';
import { FieldErrorComponent } from '../../../../shared/components/field-error/field-error.component';
import { EnderecoUsuarioFormComponent } from '../../../../shared/components/endereco-usuario-form/endereco-usuario-form.component';
import { Usuario, UsuarioUpdateRequest } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-detalhe-admin',
  standalone: true,
  imports: [
    NgIf, DatePipe, FormsModule,
    MatIconModule, MatButtonModule, MatTooltipModule,
    NavbarTopComponent, FieldErrorComponent, EnderecoUsuarioFormComponent
  ],
  templateUrl: './usuario-detalhe-admin.component.html',
  styleUrl: './usuario-detalhe-admin.component.scss'
})
export class UsuarioDetalheAdminComponent implements OnInit {

  @ViewChild(EnderecoUsuarioFormComponent) enderecoForm?: EnderecoUsuarioFormComponent;

  nome = this.auth.getNomeUsuario() ?? 'Administrador';
  loggedUserId = this.auth.getUserId();

  usuario: Usuario | null = null;
  carregando = true;
  salvando = false;
  submitted = false;

  form: UsuarioUpdateRequest = {};

  showModalConfirmDelete = false;
  showModalConfirmDesativar = false;

  get podeModificar(): boolean {
    if (!this.usuario) return false;
    return this.usuario.criadoPorId != null && this.usuario.criadoPorId === this.loggedUserId;
  }

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.usuarioService.buscarPorId(id).subscribe({
      next: u => {
        this.usuario = u;
        this.form = { nome: u.nome, email: u.email, cpf: u.cpf, celular: u.celular, tipoUsuario: u.tipoUsuario };
        this.carregando = false;
      },
      error: () => {
        this.toast.error('Usuário não encontrado');
        this.voltar();
      }
    });
  }

  salvarDados(formRef: any): void {
    this.submitted = true;
    this.enderecoForm?.markAllAsTouched();

    if (formRef.invalid || !this.usuario) return;

    const payload: UsuarioUpdateRequest = { ...this.form };
    if (this.enderecoForm) {
      payload.enderecoUsuario = this.enderecoForm.value;
    }

    this.salvando = true;
    this.usuarioService.atualizar(this.usuario.id, payload).subscribe({
      next: u => {
        this.usuario = u;
        this.form = { nome: u.nome, email: u.email, cpf: u.cpf, celular: u.celular, tipoUsuario: u.tipoUsuario };
        this.salvando = false;
        this.submitted = false;
        this.toast.success('Dados atualizados com sucesso!');
      },
      error: err => {
        this.salvando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao atualizar usuário');
      }
    });
  }

  onAtivar(): void {
    if (!this.usuario) return;
    this.usuarioService.ativar(this.usuario.id).subscribe({
      next: u => { this.usuario = u; this.toast.success('Usuário ativado.'); },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao ativar usuário')
    });
  }

  onDesativar(): void { this.showModalConfirmDesativar = true; }

  confirmarDesativar(): void {
    if (!this.usuario) return;
    this.usuarioService.desativar(this.usuario.id).subscribe({
      next: u => {
        this.usuario = u;
        this.showModalConfirmDesativar = false;
        this.toast.success('Usuário desativado.');
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao desativar usuário')
    });
  }

  onExcluir(): void { this.showModalConfirmDelete = true; }

  confirmarExclusao(): void {
    if (!this.usuario) return;
    this.usuarioService.excluir(this.usuario.id).subscribe({
      next: () => {
        this.showModalConfirmDelete = false;
        this.toast.success('Usuário excluído permanentemente.');
        this.voltar();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao excluir usuário')
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard/admin'], { queryParams: { tab: 'usuarios' } });
  }

  logout(): void { this.auth.logout(); }
}
