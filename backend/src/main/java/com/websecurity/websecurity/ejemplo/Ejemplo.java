package com.websecurity.websecurity.ejemplo;

import jakarta.persistence.*;
import com.websecurity.websecurity.modulo.Modulo;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Ejemplo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(length = 2000)
    private String descripcion;

    @Column(length = 1000)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "modulo_id")
    @JsonBackReference
    private Modulo modulo;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public Modulo getModulo() { return modulo; }
    public void setModulo(Modulo modulo) { this.modulo = modulo; }
}