package com.websecurity.websecurity.vm;

import com.websecurity.websecurity.user.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class VirtualMachine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private String enlaceDescarga;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaAñadida = new Date();

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getEnlaceDescarga() { return enlaceDescarga; }
    public void setEnlaceDescarga(String enlaceDescarga) { this.enlaceDescarga = enlaceDescarga; }

    public Date getFechaAñadida() { return fechaAñadida; }
    public void setFechaAñadida(Date fechaAñadida) { this.fechaAñadida = fechaAñadida; }

    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
}