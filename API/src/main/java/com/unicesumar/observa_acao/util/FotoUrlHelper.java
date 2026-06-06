package com.unicesumar.observa_acao.util;

import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FotoUrlHelper {

    @Value("${app.base-url}")
    private String baseUrl;

    @Named("buildFotoUrl")
    public String buildFotoUrl(String path) {
        if (path == null || path.isBlank()) return null;
        return baseUrl + "/" + path;
    }
}
