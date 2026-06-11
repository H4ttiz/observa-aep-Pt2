import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ToastService } from '../../../core/services/toast.service';
import { Categoria } from '../../../core/models/categoria.model';
import { SolicitacaoResponse } from '../../../core/models/solicitacao.model';
import { EnderecoUsuarioFormComponent } from '../../../shared/components/endereco-usuario-form/endereco-usuario-form.component';
import { FieldErrorComponent } from '../../../shared/components/field-error/field-error.component';

@Component({
  selector: 'app-nova-solicitacao',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, MatIconModule, EnderecoUsuarioFormComponent, FieldErrorComponent],
  templateUrl: './nova-solicitacao.component.html',
  styleUrl: './nova-solicitacao.component.scss'
})
export class NovaSolicitacaoComponent implements OnInit {
  @Output() solicitacaoCriada = new EventEmitter<SolicitacaoResponse>();
  @ViewChild(EnderecoUsuarioFormComponent) enderecoForm?: EnderecoUsuarioFormComponent;

  categorias: Categoria[] = [];
  enviando = false;
  submitted = false;

  form = {
    titulo: '',
    descricao: '',
    categoriaId: null as number | null,
    anonima: false,
    usarEnderecoUsuario: true
  };

  constructor(
    private solicitacaoService: SolicitacaoService,
    private categoriaService: CategoriaService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.categoriaService.listarAtivas(0, 100).subscribe({
      next: res => this.categorias = res.content,
      error: () => this.toast.error('Erro ao carregar categorias')
    });
  }

  onSubmit(formRef: NgForm): void {
    this.submitted = true;
    this.enderecoForm?.markAllAsTouched();

    if (formRef.invalid) return;
    if (!this.form.usarEnderecoUsuario && !this.enderecoForm?.valid) return;

    this.enviando = true;

    const payload = {
      titulo: this.form.titulo.trim(),
      descricao: this.form.descricao.trim(),
      categoriaId: this.form.categoriaId!,
      anonima: this.form.anonima,
      usarEnderecoUsuario: this.form.usarEnderecoUsuario,
      enderecoSolicitacao: this.form.usarEnderecoUsuario ? undefined : this.enderecoForm!.value,
      dataAbertura: new Date().toISOString()
    };

    this.solicitacaoService.criar(payload).subscribe({
      next: res => {
        this.toast.success('Solicitação enviada com sucesso!');
        this.resetForm(formRef);
        this.solicitacaoCriada.emit(res);
      },
      error: err => {
        this.toast.error(err.error?.erro ?? 'Erro ao enviar solicitação');
        this.enviando = false;
      }
    });
  }

  private resetForm(formRef: NgForm): void {
    this.submitted = false;
    this.enviando = false;
    this.form = { titulo: '', descricao: '', categoriaId: null, anonima: false, usarEnderecoUsuario: true };
    formRef.resetForm();
  }
}
