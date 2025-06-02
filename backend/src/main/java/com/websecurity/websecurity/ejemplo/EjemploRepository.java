package com.websecurity.websecurity.ejemplo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;

public interface EjemploRepository extends JpaRepository<Ejemplo, Long> {

    List<Ejemplo> findByModulo_Id(Long moduloId);
    boolean existsByModuloAndTitulo(Modulo modulo, String titulo);
}