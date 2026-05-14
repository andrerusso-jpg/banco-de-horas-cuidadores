package com.bancodehoras.dto;

import com.bancodehoras.model.Funcionario;

public record FuncionarioResumoDTO(
        Long id,
        String nome,
        int saldoMinutos,
        String saldoFormatado,
        int totalRegistros
) {
    public static FuncionarioResumoDTO from(Funcionario f) {
        int total = f.getSaldoTotalMinutos();
        String sinal = total >= 0 ? "+" : "-";
        int h = Math.abs(total) / 60;
        int m = Math.abs(total) % 60;
        return new FuncionarioResumoDTO(
                f.getId(),
                f.getNome(),
                total,
                String.format("%s%dh%02dm", sinal, h, m),
                f.getRegistros().size()
        );
    }
}
