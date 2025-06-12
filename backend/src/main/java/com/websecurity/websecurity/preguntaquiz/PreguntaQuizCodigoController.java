package com.websecurity.websecurity.preguntaquiz;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/preguntas-quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class PreguntaQuizCodigoController {
    private final PreguntaQuizCodigoService service;
    private final UsuarioService usuarioService;

    @Autowired
    public PreguntaQuizCodigoController(PreguntaQuizCodigoService service, UsuarioService usuarioService) {
        this.service = service;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/modulo/{moduloId}")
    public List<PreguntaQuizCodigo> getByModulo(@PathVariable Long moduloId) {
        return service.findByModuloId(moduloId);
    }

    @GetMapping
    public List<PreguntaQuizCodigo> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public PreguntaQuizCodigo getById(@PathVariable Long id) { return service.findById(id).orElseThrow(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody PreguntaQuizCodigo p, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN) {
            return ResponseEntity.ok(service.save(p));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PreguntaQuizCodigo p, @RequestHeader("Authorization") String authHeader) {
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