package com.websecurity.websecurity.logro;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LogroRepository extends JpaRepository<Logro, Long> {
    Logro findByNombre(String nombre);
}