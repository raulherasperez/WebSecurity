package com.websecurity.websecurity.comentario;

import com.websecurity.websecurity.user.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String modulo; // Ej: "sql-inyeccion"

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;

    @Column(columnDefinition = "TEXT")
    private String texto;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaPublicacion = new Date();

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getModulo() { return modulo; }
    public void setModulo(String modulo) { this.modulo = modulo; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public Date getFechaPublicacion() { return fechaPublicacion; }
    public void setFechaPublicacion(Date fechaPublicacion) { this.fechaPublicacion = fechaPublicacion; }
}