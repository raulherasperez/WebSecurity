
package com.websecurity.websecurity.ejemplo;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/ejemplos")
@CrossOrigin(origins = "http://localhost:3000")
public class EjemploController {
    private final EjemploService ejemploService;
    private final UsuarioService usuarioService;

    @Autowired
    public EjemploController(EjemploService ejemploService, UsuarioService usuarioService) {
        this.ejemploService = ejemploService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Ejemplo> getAll() { return ejemploService.findAll(); }

    @GetMapping("/{id}")
    public Ejemplo getById(@PathVariable Long id) { return ejemploService.findById(id).orElseThrow(); }

    @GetMapping("/modulo/{moduloId}")
    public List<Ejemplo> getByModulo(@PathVariable Long moduloId) {
        return ejemploService.findByModuloId(moduloId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Ejemplo ejemplo, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            return ResponseEntity.ok(ejemploService.save(ejemplo));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Ejemplo ejemplo, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            ejemplo.setId(id);
            return ResponseEntity.ok(ejemploService.save(ejemplo));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            ejemploService.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}