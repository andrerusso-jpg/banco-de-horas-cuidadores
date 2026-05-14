package com.bancodehoras.repository;

import com.bancodehoras.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    List<Funcionario> findByNomeContainingIgnoreCaseOrderByNome(String nome);
    boolean existsByNomeIgnoreCase(String nome);
}
