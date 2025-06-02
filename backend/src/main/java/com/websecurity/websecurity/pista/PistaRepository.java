package com.websecurity.websecurity.pista;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.Nivel;

public interface PistaRepository extends JpaRepository<Pista, Long> {
    List<Pista> findByModulo_Id(Long moduloId);
    boolean existsByModuloAndNivelAndTexto(Modulo modulo, Nivel nivel, String texto);
}