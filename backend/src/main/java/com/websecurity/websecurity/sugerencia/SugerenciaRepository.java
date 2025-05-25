// filepath: backend/src/main/java/com/websecurity/websecurity/sugerencia/SugerenciaRepository.java
package com.websecurity.websecurity.sugerencia;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SugerenciaRepository extends JpaRepository<Sugerencia, Long> {
    List<Sugerencia> findByUsuarioUsername(String username);
}