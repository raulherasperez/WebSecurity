package com.websecurity.websecurity.preguntaquiz;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreguntaQuizCodigoRepository extends JpaRepository<PreguntaQuizCodigo, Long> {
    // Repository

List<PreguntaQuizCodigo> findByModulo_Id(Long moduloId);
boolean existsByTituloAndModulo(String titulo, Modulo modulo);
}
