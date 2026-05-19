package com.bancodehoras.controller;

import com.bancodehoras.dto.*;
import com.bancodehoras.service.BancoDeHorasService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BancoDeHorasController {

    private final BancoDeHorasService service;

    public BancoDeHorasController(BancoDeHorasService service) {
        this.service = service;
    }

    @GetMapping("/funcionarios")
    public List<FuncionarioResumoDTO> listar(@RequestParam(required = false) String nome) {
        if (nome != null && !nome.isBlank()) return service.buscar(nome);
        return service.listarTodos();
    }

    @GetMapping("/funcionarios/{id}")
    public FuncionarioDetalheDTO detalhe(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping("/funcionarios")
    @ResponseStatus(HttpStatus.CREATED)
    public FuncionarioResumoDTO criar(@RequestBody Map<String, String> body) {
        return service.criarFuncionario(body.getOrDefault("nome", ""));
    }

    @PostMapping("/funcionarios/{id}/registros")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistroDTO adicionarRegistro(@PathVariable Long id,
                                         @Valid @RequestBody RegistroRequestDTO dto) {
        return service.adicionarRegistro(id, dto);
    }

    @DeleteMapping("/funcionarios/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarFuncionario(@PathVariable Long id) {
        service.deletarFuncionario(id);
    }

    @DeleteMapping("/funcionarios/{id}/registros/{registroId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarRegistro(@PathVariable Long id, @PathVariable Long registroId) {
        service.deletarRegistro(id, registroId);
    }

    @GetMapping("/resumo")
    public ResumoGeralDTO resumo() {
        return service.getResumo();
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
