package com.bancodehoras.repository;

import com.bancodehoras.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    Optional<Registro> findByIdAndFuncionarioId(Long id, Long funcionarioId);
}
