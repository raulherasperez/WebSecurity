// filepath: backend/src/main/java/com/websecurity/websecurity/reporte/ReporteErrorController.java
package com.websecurity.websecurity.reporte;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:3000")
public class ReporteErrorController {

    @Autowired
    private ReporteErrorService reporteErrorService;

    @Autowired
    private UsuarioService usuarioService;

    // Listar reportes según rol
    @GetMapping
    public ResponseEntity<List<ReporteError>> getAll(@RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN) {
            return ResponseEntity.ok(reporteErrorService.findAll());
        } else {
            return ResponseEntity.ok(reporteErrorService.findByUsuario(username));
        }
    }

    // Obtener reporte por id (solo si es propio o admin)
    @GetMapping("/{id}")
    public ResponseEntity<ReporteError> getById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        return reporteErrorService.findById(id)
                .filter(r -> r.getUsuario().getUsername().equals(username) || user.getRol() == User.Rol.ADMIN)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }

    // Crear reporte (usuario autenticado)
    @PostMapping
    public ResponseEntity<?> createReporte(@RequestBody ReporteError reporte, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        ReporteError nuevo = reporteErrorService.save(reporte, username);
        return ResponseEntity.ok(nuevo);
    }
}