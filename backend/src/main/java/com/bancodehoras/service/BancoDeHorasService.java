package com.bancodehoras.service;

import com.bancodehoras.dto.*;
import com.bancodehoras.model.Funcionario;
import com.bancodehoras.model.Registro;
import com.bancodehoras.repository.FuncionarioRepository;
import com.bancodehoras.repository.RegistroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class BancoDeHorasService {

    private final FuncionarioRepository funcionarioRepo;
    private final RegistroRepository registroRepo;

    public BancoDeHorasService(FuncionarioRepository funcionarioRepo, RegistroRepository registroRepo) {
        this.funcionarioRepo = funcionarioRepo;
        this.registroRepo = registroRepo;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResumoDTO> listarTodos() {
        return funcionarioRepo.findAll()
                .stream()
                .map(FuncionarioResumoDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResumoDTO> buscar(String nome) {
        return funcionarioRepo.findByNomeContainingIgnoreCaseOrderByNome(nome)
                .stream()
                .map(FuncionarioResumoDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public FuncionarioDetalheDTO buscarPorId(Long id) {
        Funcionario f = funcionarioRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
        return FuncionarioDetalheDTO.from(f);
    }

    public FuncionarioResumoDTO criarFuncionario(String nome) {
        String nomeUpper = nome.trim().toUpperCase();
        if (funcionarioRepo.existsByNomeIgnoreCase(nomeUpper)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Funcionário já cadastrado");
        }
        Funcionario f = funcionarioRepo.save(new Funcionario(nomeUpper));
        return FuncionarioResumoDTO.from(f);
    }

    public RegistroDTO adicionarRegistro(Long funcionarioId, RegistroRequestDTO dto) {
        Funcionario f = funcionarioRepo.findById(funcionarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));

        int totalMinutos = dto.horas() >= 0
                ? dto.horas() * 60 + dto.minutos()
                : dto.horas() * 60 - dto.minutos();

        Registro r = new Registro();
        r.setData(dto.data());
        r.setTipo(dto.tipo());
        r.setTotalMinutos(totalMinutos);
        r.setAcontecimento(dto.acontecimento());
        r.setFuncionario(f);

        return RegistroDTO.from(registroRepo.save(r));
    }

    public void deletarRegistro(Long funcionarioId, Long registroId) {
        Registro r = registroRepo.findByIdAndFuncionarioId(registroId, funcionarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado"));
        registroRepo.delete(r);
    }

    public void deletarFuncionario(Long id) {
        Funcionario f = funcionarioRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
        registroRepo.deleteAll(f.getRegistros());
        funcionarioRepo.delete(f);
    }

    @Transactional(readOnly = true)
    public ResumoGeralDTO getResumo() {
        List<Funcionario> todos = funcionarioRepo.findAll();
        int comCredito = 0, comDebito = 0, zerados = 0;
        for (Funcionario f : todos) {
            int s = f.getSaldoTotalMinutos();
            if (s > 0) comCredito++;
            else if (s < 0) comDebito++;
            else zerados++;
        }
        return new ResumoGeralDTO(todos.size(), comCredito, comDebito, zerados);
    }
}
