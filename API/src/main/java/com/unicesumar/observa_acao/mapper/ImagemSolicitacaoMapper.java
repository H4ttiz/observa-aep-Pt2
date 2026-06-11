package com.unicesumar.observa_acao.mapper;

import com.unicesumar.observa_acao.dto.imagem.ImagemSolicitacaoResponseDTO;
import com.unicesumar.observa_acao.model.ImagemSolicitacao;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImagemSolicitacaoMapper {

    ImagemSolicitacaoResponseDTO toResponseDTO(ImagemSolicitacao imagem);
}
