package com.bancodehoras.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "registros")
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegistro tipo;

    /** Minutos totais: positivo = crédito, negativo = débito */
    @Column(nullable = false)
    private int totalMinutos;

    private String acontecimento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    public Registro() {}

    public Long getId() { return id; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public TipoRegistro getTipo() { return tipo; }
    public void setTipo(TipoRegistro tipo) { this.tipo = tipo; }
    public int getTotalMinutos() { return totalMinutos; }
    public void setTotalMinutos(int totalMinutos) { this.totalMinutos = totalMinutos; }
    public String getAcontecimento() { return acontecimento; }
    public void setAcontecimento(String acontecimento) { this.acontecimento = acontecimento; }
    public Funcionario getFuncionario() { return funcionario; }
    public void setFuncionario(Funcionario funcionario) { this.funcionario = funcionario; }
}
