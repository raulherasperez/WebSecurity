package com.websecurity.websecurity.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
@Entity
@Table(name = "users")  // nombre de tabla en la BD
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 30, message = "El nombre de usuario no puede tener más de 30 caracteres")
    @Pattern(regexp = "^[A-Za-z0-9ÑñÁáÉéÍíÓóÚúÝýÜüÀàÈèÌìÒòÙùÂâÊêÎîÔôÛûÄäËëÏïÖöÜü._-]+$", message = "El nombre de usuario solo puede contener caracteres alfanuméricos, punto, guion y guion bajo")    
    @Column(unique = true)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Lob
    @Size(max = 5242880, message = "El tamaño de la imagen no puede ser mayor que 5 MB")
    private byte[] foto;

    @Column(unique = true)
    @Email
    private String email;

    @Column(nullable = false)
    private Rol rol;
    
    public enum Rol {
        USER, ADMIN, MODERATOR
    }
    public User() {
    }
    public User(String username, String password, byte[] foto, String email, Rol rol) {
        this.username = username;
        this.password = password;
        this.foto = foto;
        this.email = email;
        this.rol = rol;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public byte[] getFoto() {
        return foto;
    }
    public void setFoto(byte[] foto) {
        this.foto = foto;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
    }
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", foto=" + (foto != null ? foto.length : 0) + " bytes" +
                ", email='" + email + '\'' +
                ", rol=" + rol +
                '}';
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }
    

}
