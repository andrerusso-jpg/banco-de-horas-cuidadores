package com.bancodehoras.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("data DESC")
    private List<Registro> registros = new ArrayList<>();

    public Funcionario() {}

    public Funcionario(String nome) {
        this.nome = nome.trim().toUpperCase();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome.trim().toUpperCase(); }
    public List<Registro> getRegistros() { return registros; }

    public int getSaldoTotalMinutos() {
        return registros.stream().mapToInt(Registro::getTotalMinutos).sum();
    }
}
