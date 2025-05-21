package com.websecurity.websecurity.guia;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.websecurity.websecurity.user.User;

public interface GuiaRepository extends JpaRepository<Guia, Long> {
    List<Guia> findByUsuarioUsername(String username);

    List<Guia> findByTituloAndUsuario(String titulo, User usuario);
}