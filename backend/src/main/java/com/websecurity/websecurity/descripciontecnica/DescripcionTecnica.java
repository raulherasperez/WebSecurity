package com.websecurity.websecurity.descripciontecnica;

import jakarta.persistence.*;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.Nivel;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class DescripcionTecnica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "modulo_id")
    @JsonBackReference
    private Modulo modulo;

    @Enumerated(EnumType.STRING)
    private Nivel nivel; // FACIL, MEDIO, DIFICIL, IMPOSIBLE

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String codigoEjemplo;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Modulo getModulo() { return modulo; }
    public void setModulo(Modulo modulo) { this.modulo = modulo; }

    public Nivel getNivel() { return nivel; }
    public void setNivel(Nivel nivel) { this.nivel = nivel; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCodigoEjemplo() { return codigoEjemplo; }
    public void setCodigoEjemplo(String codigoEjemplo) { this.codigoEjemplo = codigoEjemplo; }
}