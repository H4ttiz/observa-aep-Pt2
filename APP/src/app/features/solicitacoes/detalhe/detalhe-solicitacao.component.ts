import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  SolicitacaoResponse,
  SolicitacaoUpdateRequest,
  EnderecoSolicitacaoRequest,
  GestorAprovarRequest,
  GestorRejeitarRequest,
  RevealAnonimatoRequest
} from '../../../core/models/solicitacao.model';
import { ImagemSolicitacao } from '../../../core/models/imagem.model';
import { Categoria } from '../../../core/models/categoria.model';
import { NavbarTopComponent } from '../../../shared/components/navbar-top/navbar-top.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LeafletMapComponent } from '../../../shared/components/leaflet-map/leaflet-map.component';

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_TAMANHO_MB = 5;
const MAX_IMAGENS = 5;

@Component({
  selector: 'app-detalhe-solicitacao',
  standalone: true,
  imports: [
    NgIf, NgFor, DatePipe, FormsModule,
    MatIconModule, MatButtonModule,
    NavbarTopComponent, StatusBadgeComponent, LeafletMapComponent
  ],
  templateUrl: './detalhe-solicitacao.component.html',
  styleUrl: './detalhe-solicitacao.component.scss'
})
export class DetalheSolicitacaoComponent implements OnInit {

  nome = this.auth.getNomeUsuario() ?? 'Usuário';
  role = this.auth.getTipoUsuario();
  userId = this.auth.getUserId();

  solicitacao: SolicitacaoResponse | null = null;
  carregando = true;
  erro: string | null = null;
  processando = false;

  showModalAprovar = false;
  showModalRejeitar = false;
  showModalReativar = false;
  aprovarDTO: GestorAprovarRequest = { prioridade: '', dataPrazo: '' };
  rejeitarDTO: GestorRejeitarRequest = { observacao: '' };

  showModalAnonimato = false;
  anonimatoDTO: RevealAnonimatoRequest = { senhaAdm: '', observacao: '' };

  imagemLightbox: ImagemSolicitacao | null = null;

  adicionandoImagens = false;
  removendoImagemId: number | null = null;

  showFormEditar = false;
  editarProcessando = false;
  categorias: Categoria[] = [];
  carregandoCategorias = false;
  editarDTO: {
    titulo: string;
    descricao: string;
    categoriaId: number | null;
    editarEndereco: boolean;
    endereco: EnderecoSolicitacaoRequest;
  } = this.editarDTOVazio();

  get eGestor(): boolean { return this.role === 'GESTOR'; }
  get eAtendente(): boolean { return this.role === 'ATENDENTE'; }
  get eAdmin(): boolean { return this.role === 'ADMINISTRADOR'; }

  get podeGerenciarImagens(): boolean {
    if (!this.solicitacao) return false;
    if (this.solicitacao.status !== 'AGUARDANDO_APROVACAO') return false;
    if (this.eAdmin) return true;
    return this.role === 'CIDADAO' && this.solicitacao.solicitanteId === this.userId;
  }

  get podeCidadaoEditar(): boolean {
    if (!this.solicitacao) return false;
    if (this.role !== 'CIDADAO') return false;
    if (this.solicitacao.status !== 'AGUARDANDO_APROVACAO') return false;
    return this.solicitacao.solicitanteId === this.userId;
  }

  get motivoRejeicao(): string | undefined {
    return this.solicitacao?.historicos?.find(h => h.statusNovo === 'REJEITADA')?.observacao;
  }

  constructor(
    private auth: AuthService,
    private service: SolicitacaoService,
    private categoriaService: CategoriaService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.buscarPorId(id).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Solicitação não encontrada ou você não tem permissão para visualizá-la.';
        this.carregando = false;
      }
    });
  }

  estaAtrasada(): boolean {
    if (!this.solicitacao?.dataPrazo) return false;
    const s = this.solicitacao.status;
    if (s === 'FINALIZADA' || s === 'REJEITADA') return false;
    return new Date(this.solicitacao.dataPrazo) < new Date();
  }

  voltar(): void { this.location.back(); }

  abrirModalAprovar(): void {
    this.aprovarDTO = { prioridade: '', dataPrazo: '' };
    this.showModalAprovar = true;
  }

  confirmarAprovar(): void {
    if (!this.solicitacao || !this.aprovarDTO.prioridade || !this.aprovarDTO.dataPrazo) return;
    this.processando = true;
    this.service.aprovar(this.solicitacao.id, this.aprovarDTO).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.showModalAprovar = false;
        this.processando = false;
        this.toast.success('Solicitação aprovada!');
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao aprovar');
      }
    });
  }

  abrirModalRejeitar(): void {
    this.rejeitarDTO = { observacao: '' };
    this.showModalRejeitar = true;
  }

  confirmarRejeitar(): void {
    if (!this.solicitacao || !this.rejeitarDTO.observacao.trim()) return;
    this.processando = true;
    this.service.rejeitar(this.solicitacao.id, this.rejeitarDTO).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.showModalRejeitar = false;
        this.processando = false;
        this.toast.success('Solicitação rejeitada.');
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao rejeitar');
      }
    });
  }

  abrirModalReativar(): void { this.showModalReativar = true; }

  confirmarReativar(): void {
    if (!this.solicitacao) return;
    this.processando = true;
    this.service.reativar(this.solicitacao.id).subscribe({
      next: () => {
        this.showModalReativar = false;
        this.processando = false;
        this.toast.success('Solicitação reativada para nova análise.');
        this.router.navigate(['/dashboard/gestor'], { queryParams: { tab: 'recusadas' } });
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao reativar');
      }
    });
  }

  onPegar(): void {
    if (!this.solicitacao) return;
    this.service.pegar(this.solicitacao.id).subscribe({
      next: sol => { this.solicitacao = sol; this.toast.success('Solicitação assumida!'); },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao assumir')
    });
  }

  onFinalizar(): void {
    if (!this.solicitacao) return;
    this.service.finalizar(this.solicitacao.id).subscribe({
      next: sol => { this.solicitacao = sol; this.toast.success('Solicitação finalizada!'); },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao finalizar')
    });
  }

  onDesvincular(): void {
    if (!this.solicitacao) return;
    this.service.desvincular(this.solicitacao.id).subscribe({
      next: () => {
        this.toast.success('Desvinculado da solicitação.');
        this.voltar();
      },
      error: err => this.toast.error(err.error?.erro ?? 'Erro ao desvincular')
    });
  }

  abrirModalAnonimato(): void {
    this.anonimatoDTO = { senhaAdm: '', observacao: '' };
    this.showModalAnonimato = true;
  }

  confirmarAnonimato(): void {
    if (!this.solicitacao) return;
    this.processando = true;
    this.service.revelarAnonimato(this.solicitacao.id, this.anonimatoDTO).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.showModalAnonimato = false;
        this.processando = false;
        this.toast.success('Identidade do solicitante revelada.');
      },
      error: err => {
        this.processando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao revelar anonimato');
      }
    });
  }

  abrirLightbox(img: ImagemSolicitacao): void {
    this.imagemLightbox = img;
  }

  fecharLightbox(): void {
    this.imagemLightbox = null;
  }

  onArquivosParaAdicionar(event: Event): void {
    if (!this.solicitacao) return;
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const arquivos = Array.from(input.files);
    const disponiveis = MAX_IMAGENS - (this.solicitacao.imagens?.length ?? 0);

    if (arquivos.length > disponiveis) {
      this.toast.error(`Você pode adicionar no máximo ${disponiveis} imagem(ns) a mais.`);
      input.value = '';
      return;
    }

    for (const arquivo of arquivos) {
      if (!TIPOS_ACEITOS.includes(arquivo.type)) {
        this.toast.error(`"${arquivo.name}": tipo não permitido. Use JPEG, PNG ou WebP.`);
        input.value = '';
        return;
      }
      if (arquivo.size > MAX_TAMANHO_MB * 1024 * 1024) {
        this.toast.error(`"${arquivo.name}": tamanho máximo é ${MAX_TAMANHO_MB}MB.`);
        input.value = '';
        return;
      }
    }

    this.adicionandoImagens = true;
    this.service.adicionarImagens(this.solicitacao.id, arquivos).subscribe({
      next: () => {
        this.recarregarSolicitacao();
        this.toast.success('Imagens adicionadas com sucesso.');
        input.value = '';
      },
      error: err => {
        this.adicionandoImagens = false;
        this.toast.error(err.error?.erro ?? 'Erro ao adicionar imagens');
        input.value = '';
      }
    });
  }

  onRemoverImagem(imgId: number): void {
    if (!this.solicitacao) return;
    this.removendoImagemId = imgId;
    this.service.removerImagem(this.solicitacao.id, imgId).subscribe({
      next: () => {
        this.removendoImagemId = null;
        this.recarregarSolicitacao();
        this.toast.success('Imagem removida.');
      },
      error: err => {
        this.removendoImagemId = null;
        this.toast.error(err.error?.erro ?? 'Erro ao remover imagem');
      }
    });
  }

  abrirFormEditar(): void {
    if (!this.solicitacao) return;
    this.editarDTO = {
      titulo: this.solicitacao.titulo,
      descricao: this.solicitacao.descricao,
      categoriaId: this.solicitacao.categoriaId,
      editarEndereco: false,
      endereco: {
        cep: this.solicitacao.enderecoSolicitacao?.cep ?? '',
        logradouro: this.solicitacao.enderecoSolicitacao?.logradouro ?? '',
        numero: this.solicitacao.enderecoSolicitacao?.numero ?? '',
        complemento: this.solicitacao.enderecoSolicitacao?.complemento,
        bairro: this.solicitacao.enderecoSolicitacao?.bairro ?? '',
        cidade: this.solicitacao.enderecoSolicitacao?.cidade ?? '',
        estado: this.solicitacao.enderecoSolicitacao?.estado ?? ''
      }
    };

    if (!this.categorias.length) {
      this.carregandoCategorias = true;
      this.categoriaService.listarAtivas(0, 100).subscribe({
        next: res => {
          this.categorias = res.content;
          this.carregandoCategorias = false;
        },
        error: () => {
          this.carregandoCategorias = false;
          this.toast.error('Erro ao carregar categorias');
        }
      });
    }

    this.showFormEditar = true;
  }

  fecharFormEditar(): void {
    this.showFormEditar = false;
  }

  confirmarEditar(): void {
    if (!this.solicitacao || !this.editarDTO.titulo.trim() || !this.editarDTO.descricao.trim() || !this.editarDTO.categoriaId) return;
    this.editarProcessando = true;

    const dto: SolicitacaoUpdateRequest = {
      titulo: this.editarDTO.titulo.trim(),
      descricao: this.editarDTO.descricao.trim(),
      categoriaId: this.editarDTO.categoriaId!,
      enderecoSolicitacao: this.editarDTO.editarEndereco ? this.editarDTO.endereco : undefined
    };

    this.service.atualizar(this.solicitacao.id, dto).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.editarProcessando = false;
        this.showFormEditar = false;
        this.toast.success('Solicitação atualizada com sucesso!');
      },
      error: err => {
        this.editarProcessando = false;
        this.toast.error(err.error?.erro ?? 'Erro ao atualizar solicitação');
      }
    });
  }

  private recarregarSolicitacao(): void {
    if (!this.solicitacao) return;
    this.service.buscarPorId(this.solicitacao.id).subscribe({
      next: sol => {
        this.solicitacao = sol;
        this.adicionandoImagens = false;
      },
      error: () => { this.adicionandoImagens = false; }
    });
  }

  private editarDTOVazio() {
    return {
      titulo: '',
      descricao: '',
      categoriaId: null as number | null,
      editarEndereco: false,
      endereco: {
        cep: '', logradouro: '', numero: '',
        complemento: undefined as string | undefined,
        bairro: '', cidade: '', estado: ''
      }
    };
  }

  logout(): void { this.auth.logout(); }
}
