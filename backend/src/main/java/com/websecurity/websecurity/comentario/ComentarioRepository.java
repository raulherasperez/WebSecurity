package com.websecurity.websecurity.comentario;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByModuloOrderByFechaPublicacionAsc(String modulo);
}
