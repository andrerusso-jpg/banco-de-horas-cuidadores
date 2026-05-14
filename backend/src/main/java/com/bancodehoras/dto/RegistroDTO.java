package com.bancodehoras.dto;

import com.bancodehoras.model.Registro;
import java.time.format.DateTimeFormatter;

public record RegistroDTO(
        Long id,
        String data,
        String tipo,
        String tipoDescricao,
        int totalMinutos,
        String horasFormatadas,
        String acontecimento
) {
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static RegistroDTO from(Registro r) {
        int total = r.getTotalMinutos();
        String sinal = total >= 0 ? "+" : "-";
        int h = Math.abs(total) / 60;
        int m = Math.abs(total) % 60;
        return new RegistroDTO(
                r.getId(),
                r.getData().format(FMT),
                r.getTipo().name(),
                r.getTipo().getDescricao(),
                total,
                String.format("%s%dh%02dm", sinal, h, m),
                r.getAcontecimento() != null ? r.getAcontecimento() : ""
        );
    }
}
