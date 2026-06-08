package com.unicesumar.observa_acao.util;

public final class ValidacaoUtil {

    private ValidacaoUtil() {}

    public static boolean celularValido(String celular) {
        if (celular == null) return false;
        String digits = celular.replaceAll("\\D", "");
        return digits.length() == 10 || digits.length() == 11;
    }

    public static String normalizarCelular(String celular) {
        if (celular == null) return null;
        return celular.replaceAll("\\D", "");
    }
}
