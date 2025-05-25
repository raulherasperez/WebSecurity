package com.websecurity.websecurity.glosario;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TerminoRepository extends JpaRepository<Termino, Long> {
    boolean existsByTermino(String termino);
}