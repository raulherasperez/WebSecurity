// filepath: backend/src/main/java/com/websecurity/websecurity/reporte/ReporteErrorService.java
package com.websecurity.websecurity.reporte;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReporteErrorService {

    @Autowired
    private ReporteErrorRepository reporteErrorRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ReporteError> findAll() {
        return reporteErrorRepository.findAll();
    }

    public List<ReporteError> findByUsuario(String username) {
        return reporteErrorRepository.findByUsuarioUsername(username);
    }

    public Optional<ReporteError> findById(Long id) {
        return reporteErrorRepository.findById(id);
    }

    public ReporteError save(ReporteError reporte, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        reporte.setUsuario(user);
        reporte.setFechaPublicacion(new java.util.Date());
        return reporteErrorRepository.save(reporte);
    }
}