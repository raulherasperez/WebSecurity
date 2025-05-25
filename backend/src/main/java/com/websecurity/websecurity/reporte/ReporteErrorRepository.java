// filepath: backend/src/main/java/com/websecurity/websecurity/reporte/ReporteErrorRepository.java
package com.websecurity.websecurity.reporte;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReporteErrorRepository extends JpaRepository<ReporteError, Long> {
    List<ReporteError> findByUsuarioUsername(String username);
}