package com.websecurity.websecurity.glosario;

import jakarta.persistence.*;

@Entity
public class Termino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String termino;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String significado;

    private String enlaceReferencia;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTermino() { return termino; }
    public void setTermino(String termino) { this.termino = termino; }

    public String getSignificado() { return significado; }
    public void setSignificado(String significado) { this.significado = significado; }

    public String getEnlaceReferencia() { return enlaceReferencia; }
    public void setEnlaceReferencia(String enlaceReferencia) { this.enlaceReferencia = enlaceReferencia; }
}