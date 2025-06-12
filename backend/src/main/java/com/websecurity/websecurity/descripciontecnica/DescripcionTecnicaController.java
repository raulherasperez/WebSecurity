
package com.websecurity.websecurity.descripciontecnica;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/descripciones-tecnicas")
@CrossOrigin(origins = "http://localhost:3000")
public class DescripcionTecnicaController {
    private final DescripcionTecnicaService service;
    private final UsuarioService usuarioService;

    @Autowired
    public DescripcionTecnicaController(DescripcionTecnicaService service, UsuarioService usuarioService) {
        this.service = service;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<DescripcionTecnica> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public DescripcionTecnica getById(@PathVariable Long id) {
        return service.findById(id).orElseThrow();
    }

    @GetMapping("/modulo/{moduloId}")
    public List<DescripcionTecnica> getByModulo(@PathVariable Long moduloId) {
        return service.findByModuloId(moduloId);
    }

    @GetMapping("/modulo/{moduloId}/nivel/{nivel}")
    public List<DescripcionTecnica> getByModuloAndNivel(@PathVariable Long moduloId, @PathVariable com.websecurity.websecurity.modulo.Nivel nivel) {
        return service.findByModuloIdAndNivel(moduloId, nivel);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DescripcionTecnica d, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            return ResponseEntity.ok(service.save(d));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody DescripcionTecnica d, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            d.setId(id);
            return ResponseEntity.ok(service.save(d));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}