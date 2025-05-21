package com.websecurity.websecurity.guia;

import com.websecurity.websecurity.user.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guias")
@CrossOrigin(origins = "http://localhost:3000")
public class GuiaController {

    @Autowired
    private GuiaService guiaService;

    @Autowired
    private UsuarioService usuarioService;

    // Obtener todas las guías (público)
    @GetMapping
    public List<Guia> getAll() {
        return guiaService.findAll();
    }

    // Obtener una guía por id (público)
    @GetMapping("/{id}")
    public ResponseEntity<Guia> getById(@PathVariable Long id) {
        return guiaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear guía (usuario autenticado)
    @PostMapping
    public ResponseEntity<?> createGuia(@RequestBody Guia guia, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        Guia nueva = guiaService.save(guia, username);
        return ResponseEntity.ok(nueva);
    }

    // Editar guía (solo autor)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGuia(@PathVariable Long id, @RequestBody Guia guia, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        try {
            Guia actualizada = guiaService.update(id, guia, username);
            return ResponseEntity.ok(actualizada);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    // Borrar guía (solo autor)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGuia(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        try {
            guiaService.delete(id, username);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}