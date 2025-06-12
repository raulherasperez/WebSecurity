package com.websecurity.websecurity.modulo;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/modulos")
@CrossOrigin(origins = "http://localhost:3000")
public class ModuloController {
    private final ModuloService moduloService;
    private final UsuarioService usuarioService;

    @Autowired
    public ModuloController(ModuloService moduloService, UsuarioService usuarioService) {
        this.moduloService = moduloService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Modulo> getAll() {
        return moduloService.findAll();
    }

    @GetMapping("/{id}")
    public Modulo getById(@PathVariable Long id) {
        return moduloService.findById(id).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Modulo modulo, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            return ResponseEntity.ok(moduloService.save(modulo));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Modulo modulo, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            modulo.setId(id);
            return ResponseEntity.ok(moduloService.save(modulo));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            moduloService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}