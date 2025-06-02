package com.websecurity.websecurity.preguntaquiz;

import jakarta.persistence.*;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class PreguntaQuizCodigo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @ElementCollection
    private List<String> codigo;

    private Integer vulnerableLine;

    @Column(length = 1000)
    private String explicacion;

    @ManyToOne
    @JoinColumn(name = "modulo_id")
    @JsonBackReference
    private Modulo modulo;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public List<String> getCodigo() { return codigo; }
    public void setCodigo(List<String> codigo) { this.codigo = codigo; }

    public Integer getVulnerableLine() { return vulnerableLine; }
    public void setVulnerableLine(Integer vulnerableLine) { this.vulnerableLine = vulnerableLine; }

    public String getExplicacion() { return explicacion; }
    public void setExplicacion(String explicacion) { this.explicacion = explicacion; }

    public Modulo getModulo() { return modulo; }
    public void setModulo(Modulo modulo) { this.modulo = modulo; }

    @Transient
    public Long getModuloId() {
        return modulo != null ? modulo.getId() : null;
    }

   
}