package com.websecurity.websecurity.preguntateorica;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/preguntas-teoricas")
@CrossOrigin(origins = "http://localhost:3000")
public class PreguntaTeoricaController {
    private final PreguntaTeoricaService service;
    private final UsuarioService usuarioService;

    @Autowired
    public PreguntaTeoricaController(PreguntaTeoricaService service, UsuarioService usuarioService) {
        this.service = service;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<PreguntaTeorica> getAll() { return service.findAll(); }

    @GetMapping("/modulo/{moduloId}")
    public List<PreguntaTeorica> getByModulo(@PathVariable Long moduloId) {
        return service.findByModuloId(moduloId);
    }

    @GetMapping("/{id}")
    public PreguntaTeorica getById(@PathVariable Long id) { return service.findById(id).orElseThrow(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PreguntaTeorica p, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            return ResponseEntity.ok(service.save(p));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PreguntaTeorica p, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            p.setId(id);
            return ResponseEntity.ok(service.save(p));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            service.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}