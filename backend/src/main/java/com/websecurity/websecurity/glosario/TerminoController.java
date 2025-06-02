package com.websecurity.websecurity.glosario;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/glosario")
@CrossOrigin(origins = "http://localhost:3000")
public class TerminoController {

    @Autowired
    private TerminoService terminoService;

    @Autowired
    private UsuarioService usuarioService;

    // Ver todos los términos (usuarios y admins)
    @GetMapping
    public List<Termino> getAll() {
        return terminoService.findAll();
    }

    // Ver un término por id (usuarios y admins)
    @GetMapping("/{id}")
    public ResponseEntity<Termino> getById(@PathVariable Long id) {
        return terminoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear término (solo admin)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Termino termino, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            return ResponseEntity.ok(terminoService.save(termino));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    // Editar término (solo admin)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Termino termino, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            return terminoService.findById(id)
                    .map(t -> {
                        t.setTermino(termino.getTermino());
                        t.setSignificado(termino.getSignificado());
                        t.setEnlaceReferencia(termino.getEnlaceReferencia());
                        return ResponseEntity.ok(terminoService.save(t));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    // Borrar término (solo admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            terminoService.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}