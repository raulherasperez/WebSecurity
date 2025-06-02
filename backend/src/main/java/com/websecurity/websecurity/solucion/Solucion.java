package com.websecurity.websecurity.solucion;

import jakarta.persistence.*;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.Nivel;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Solucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Nivel nivel;

    @ManyToOne
    @JoinColumn(name = "modulo_id")
    @JsonBackReference
    private Modulo modulo;

    @Column(length = 1000)
    private String texto;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Nivel getNivel() { return nivel; }
    public void setNivel(Nivel nivel) { this.nivel = nivel; }

    public Modulo getModulo() { return modulo; }
    public void setModulo(Modulo modulo) { this.modulo = modulo; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
}