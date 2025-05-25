// filepath: backend/src/main/java/com/websecurity/websecurity/sugerencia/SugerenciaController.java
package com.websecurity.websecurity.sugerencia;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sugerencias")
@CrossOrigin(origins = "http://localhost:3000")
public class SugerenciaController {

    @Autowired
    private SugerenciaService sugerenciaService;

    @Autowired
    private UsuarioService usuarioService;

    // Listar sugerencias según rol
    @GetMapping
    public ResponseEntity<List<Sugerencia>> getAll(@RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN) {
            return ResponseEntity.ok(sugerenciaService.findAll());
        } else {
            return ResponseEntity.ok(sugerenciaService.findByUsuario(username));
        }
    }

    // Obtener sugerencia por id (solo si es propia o admin)
    @GetMapping("/{id}")
    public ResponseEntity<Sugerencia> getById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        return sugerenciaService.findById(id)
                .filter(s -> s.getUsuario().getUsername().equals(username) || user.getRol() == User.Rol.ADMIN)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }

    // Crear sugerencia (usuario autenticado)
    @PostMapping
    public ResponseEntity<?> createSugerencia(@RequestBody Sugerencia sugerencia, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        Sugerencia nueva = sugerenciaService.save(sugerencia, username);
        return ResponseEntity.ok(nueva);
    }
}