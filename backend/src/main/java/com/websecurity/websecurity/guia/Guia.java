package com.websecurity.websecurity.guia;

import com.websecurity.websecurity.user.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Guia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaAñadida;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Date getFechaAñadida() {
        return fechaAñadida;
    }

    public void setFechaAñadida(Date fechaAñadida) {
        this.fechaAñadida = fechaAñadida;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }
}