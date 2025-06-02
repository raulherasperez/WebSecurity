package com.websecurity.websecurity.modulo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface ModuloRepository extends JpaRepository<Modulo, Long> {

  Optional<Modulo> findByNombre(String nombre);
}