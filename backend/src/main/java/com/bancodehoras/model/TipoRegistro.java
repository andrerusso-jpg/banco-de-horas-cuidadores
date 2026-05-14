package com.bancodehoras.model;

public enum TipoRegistro {
    CAPACITACAO_REUNIAO("Capacitação/Reunião"),
    ATESTADO("Atestado"),
    OUTROS("Outros");

    private final String descricao;

    TipoRegistro(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
