package com.websecurity.websecurity.modulo;

import jakarta.persistence.*;
import java.util.List;
import com.websecurity.websecurity.ejemplo.Ejemplo;
import com.websecurity.websecurity.preguntateorica.PreguntaTeorica;
import com.websecurity.websecurity.preguntaquiz.PreguntaQuizCodigo;
import com.websecurity.websecurity.solucion.Solucion;
import com.websecurity.websecurity.pista.Pista;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnica;

@Entity
public class Modulo {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String descripcionEjercicios;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Ejemplo> ejemplos;

    private String videoUrl;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PreguntaTeorica> preguntasTeoricas;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PreguntaQuizCodigo> preguntasQuizCodigo;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Solucion> soluciones;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Pista> pistas;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private java.util.List<DescripcionTecnica> descripcionesTecnicas;

    @Column(columnDefinition = "TEXT")
    private String infoEntorno;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<Ejemplo> getEjemplos() { return ejemplos; }
    public void setEjemplos(List<Ejemplo> ejemplos) { this.ejemplos = ejemplos; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public List<PreguntaTeorica> getPreguntasTeoricas() { return preguntasTeoricas; }
    public void setPreguntasTeoricas(List<PreguntaTeorica> preguntasTeoricas) { this.preguntasTeoricas = preguntasTeoricas; }

    public List<PreguntaQuizCodigo> getPreguntasQuizCodigo() { return preguntasQuizCodigo; }
    public void setPreguntasQuizCodigo(List<PreguntaQuizCodigo> preguntasQuizCodigo) { this.preguntasQuizCodigo = preguntasQuizCodigo; }

    public List<Solucion> getSoluciones() { return soluciones; }
    public void setSoluciones(List<Solucion> soluciones) { this.soluciones = soluciones; }

    public List<Pista> getPistas() { return pistas; }
    public void setPistas(List<Pista> pistas) { this.pistas = pistas; }

    public String getInfoEntorno() { return infoEntorno; }
    public void setInfoEntorno(String infoEntorno) { this.infoEntorno = infoEntorno; }

    public String getDescripcionEjercicios() {
    return descripcionEjercicios;
    }

    public void setDescripcionEjercicios(String descripcionEjercicios) {
        this.descripcionEjercicios = descripcionEjercicios;
    }
}