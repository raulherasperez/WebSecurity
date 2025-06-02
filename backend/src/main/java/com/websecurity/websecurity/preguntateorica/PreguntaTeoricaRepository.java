package com.websecurity.websecurity.preguntateorica;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;



public interface PreguntaTeoricaRepository extends JpaRepository<PreguntaTeorica, Long> {
    List<PreguntaTeorica> findByModulo_Id(Long moduloId);
    boolean existsByPreguntaAndModulo(String pregunta, Modulo modulo);
}