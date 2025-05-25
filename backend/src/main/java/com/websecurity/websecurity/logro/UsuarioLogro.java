package com.websecurity.websecurity.logro;

import com.websecurity.websecurity.user.User;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class UsuarioLogro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;

    @ManyToOne
    @JoinColumn(name = "logro_id")
    private Logro logro;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaDesbloqueo = new Date();

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }

    public Logro getLogro() { return logro; }
    public void setLogro(Logro logro) { this.logro = logro; }

    public Date getFechaDesbloqueo() { return fechaDesbloqueo; }
    public void setFechaDesbloqueo(Date fechaDesbloqueo) { this.fechaDesbloqueo = fechaDesbloqueo; }
}