package com.websecurity.websecurity.descripciontecnica;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.Nivel;

public interface DescripcionTecnicaRepository extends JpaRepository<DescripcionTecnica, Long> {
    List<DescripcionTecnica> findByModuloId(Long moduloId);
    List<DescripcionTecnica> findByModuloIdAndNivel(Long moduloId, com.websecurity.websecurity.modulo.Nivel nivel);
    boolean existsByModuloAndNivelAndDescripcion(Modulo modulo, Nivel nivel, String descripcion);
}