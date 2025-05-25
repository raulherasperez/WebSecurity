package com.websecurity.websecurity.comentario;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "http://localhost:3000")
public class ComentarioController {
    @Autowired
    private ComentarioService comentarioService;
    @Autowired
    private UsuarioService usuarioService;

    // Obtener comentarios de un módulo
    @GetMapping("/{modulo}")
    public List<Comentario> getComentarios(@PathVariable String modulo) {
        return comentarioService.getComentariosPorModulo(modulo);
    }

    // Crear comentario (usuario autenticado)
    @PostMapping
    public ResponseEntity<?> crearComentario(@RequestBody Comentario comentario, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        Comentario nuevo = comentarioService.crearComentario(comentario.getModulo(), comentario.getTexto(), username);
        return ResponseEntity.ok(nuevo);
    }

    // Eliminar comentario (solo moderador o admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarComentario(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN || user.getRol() == User.Rol.MODERATOR) {
            comentarioService.eliminarComentario(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}