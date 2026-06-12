package com.unicesumar.observa_acao.util;

public final class CpfUtil {

    private CpfUtil() {}

    public static boolean isCpfValido(String cpf) {
        if (cpf == null) return false;

        String digits = cpf.replaceAll("\\D", "");

        if (digits.length() != 11) return false;

        if (digits.matches("(\\d)\\1{10}")) return false;

        int firstDigit = calcularDigitoVerificador(digits, 10);
        if (firstDigit != (digits.charAt(9) - '0')) return false;

        int secondDigit = calcularDigitoVerificador(digits, 11);
        return secondDigit == (digits.charAt(10) - '0');
    }

    public static String normalizar(String cpf) {
        if (cpf == null) return null;
        return cpf.replaceAll("\\D", "");
    }

    private static int calcularDigitoVerificador(String digits, int peso) {
        int soma = 0;
        for (int i = 0; i < peso - 1; i++) {
            soma += (digits.charAt(i) - '0') * (peso - i);
        }
        int resto = soma % 11;
        return (resto < 2) ? 0 : 11 - resto;
    }
}
