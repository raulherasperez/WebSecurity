package com.websecurity.websecurity.logro;

import com.websecurity.websecurity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioLogroRepository extends JpaRepository<UsuarioLogro, Long> {
    List<UsuarioLogro> findByUsuario(User usuario);
    boolean existsByUsuarioAndLogro(User usuario, Logro logro);
}