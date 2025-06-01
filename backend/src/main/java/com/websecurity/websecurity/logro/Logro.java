package com.websecurity.websecurity.logro;

import jakarta.persistence.*;

@Entity
public class Logro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false)
    private String descripcion;

    // Puede ser una URL o el nombre de un archivo en /uploads
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] icono;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public byte[] getIcono() { return icono; }
    public void setIcono(byte[] icono) { this.icono = icono; }
}