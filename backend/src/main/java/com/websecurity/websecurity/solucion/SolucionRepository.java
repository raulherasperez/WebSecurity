package com.websecurity.websecurity.solucion;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.Nivel;

public interface SolucionRepository extends JpaRepository<Solucion, Long> {
    List<Solucion> findByModulo_Id(Long moduloId);
    boolean existsByModuloAndNivelAndTexto(Modulo modulo, Nivel nivel, String texto);
}