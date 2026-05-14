package com.bancodehoras.dto;

import com.bancodehoras.model.Funcionario;
import java.util.List;

public record FuncionarioDetalheDTO(
        Long id,
        String nome,
        int saldoMinutos,
        String saldoFormatado,
        List<RegistroDTO> registros
) {
    public static FuncionarioDetalheDTO from(Funcionario f) {
        int total = f.getSaldoTotalMinutos();
        String sinal = total >= 0 ? "+" : "-";
        int h = Math.abs(total) / 60;
        int m = Math.abs(total) % 60;
        return new FuncionarioDetalheDTO(
                f.getId(),
                f.getNome(),
                total,
                String.format("%s%dh%02dm", sinal, h, m),
                f.getRegistros().stream().map(RegistroDTO::from).toList()
        );
    }
}
