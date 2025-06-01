package com.websecurity.websecurity.guia;

import com.websecurity.websecurity.user.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroService;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/guias")
@CrossOrigin(origins = "http://localhost:3000")
public class GuiaController {

    @Autowired
    private GuiaService guiaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private LogroService logroService;

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

        // Desbloquear logro "Alma de guía" si es la primera vez
        Logro logroDesbloqueado = logroService.desbloquearLogro(username, "Alma de guía");

        // Devuelve la guía y, si corresponde, el logro desbloqueado
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("guia", nueva);
        if (logroDesbloqueado != null) {
            response.put("logroDesbloqueado", logroDesbloqueado);
        }

        return ResponseEntity.ok(response);
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