package com.bancodehoras.dto;

import com.bancodehoras.model.TipoRegistro;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record RegistroRequestDTO(
        @NotNull LocalDate data,
        @NotNull TipoRegistro tipo,
        int horas,
        @Min(0) @Max(59) int minutos,
        String acontecimento
) {}
