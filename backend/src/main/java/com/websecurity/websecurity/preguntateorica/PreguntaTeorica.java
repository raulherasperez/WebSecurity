package com.websecurity.websecurity.preguntateorica;

import jakarta.persistence.*;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class PreguntaTeorica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pregunta;

    @ElementCollection
    private List<String> opciones;

    private String respuesta;

    @ManyToOne
    @JoinColumn(name = "modulo_id")
    @JsonBackReference
    private Modulo modulo;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPregunta() { return pregunta; }
    public void setPregunta(String pregunta) { this.pregunta = pregunta; }

    public List<String> getOpciones() { return opciones; }
    public void setOpciones(List<String> opciones) { this.opciones = opciones; }

    public String getRespuesta() { return respuesta; }
    public void setRespuesta(String respuesta) { this.respuesta = respuesta; }

    public Modulo getModulo() { return modulo; }
    public void setModulo(Modulo modulo) { this.modulo = modulo; }
}