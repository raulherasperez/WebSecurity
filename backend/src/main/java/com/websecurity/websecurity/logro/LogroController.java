package com.websecurity.websecurity.logro;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logros")
@CrossOrigin(origins = "http://localhost:3000")
public class LogroController {

    @Autowired
    private LogroService logroService;

    @Autowired
    private UsuarioService usuarioService;

    // ADMIN: CRUD de logros
    @GetMapping
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN) {
            return ResponseEntity.ok(logroService.findAll());
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Logro logro, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN) {
            return ResponseEntity.ok(logroService.create(logro));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Logro logro, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN) {
            return ResponseEntity.ok(logroService.update(id, logro));
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN) {
            logroService.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    // USUARIO: ver logros desbloqueados y pendientes
    @GetMapping("/usuario/desbloqueados")
    public List<UsuarioLogro> getLogrosDesbloqueados(@RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        return logroService.getLogrosDesbloqueados(username);
    }

    @GetMapping("/usuario/pendientes")
    public List<Logro> getLogrosPendientes(@RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        return logroService.getLogrosPendientes(username);
    }

    // ----------- ENDPOINT PARA DESBLOQUEAR LOGRO -----------
    @PostMapping("/usuario/desbloquear")
    public ResponseEntity<?> desbloquearLogro(@RequestHeader("Authorization") String authHeader, @RequestParam String nombreLogro) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        Logro logro = logroService.desbloquearLogro(username, nombreLogro);
        if (logro != null) {
            return ResponseEntity.ok(logro);
        } else {
            return ResponseEntity.badRequest().body("Ya desbloqueado o logro inexistente");
        }
    }
}