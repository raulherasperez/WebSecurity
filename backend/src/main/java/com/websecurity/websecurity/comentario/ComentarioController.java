package com.websecurity.websecurity.comentario;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.modulo.Modulo;
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

    // Obtener comentarios de un módulo por ID
    @GetMapping("/modulo/{moduloId}")
    public List<Comentario> getComentarios(@PathVariable Long moduloId) {
        return comentarioService.getComentariosPorModulo(moduloId);
    }

    // Crear comentario (usuario autenticado)
    @PostMapping
    public ResponseEntity<?> crearComentario(@RequestBody Comentario comentario, @RequestHeader("Authorization") String authHeader) {
        System.out.println("Comentario recibido: " + comentario);
        System.out.println("Modulo: " + comentario.getModulo());
        if (comentario.getModulo() == null || comentario.getModulo().getId() == null) {
                return ResponseEntity.badRequest().body("El comentario debe tener un módulo válido");
            }
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        Comentario nuevo = comentarioService.crearComentario(
            comentario.getModulo().getId(),
            comentario.getTexto(),
            username
        );
        return ResponseEntity.ok(nuevo);
    }

    // Eliminar comentario (solo moderador o admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarComentario(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ROLE_ADMIN || user.getRol() == User.Rol.MODERATOR) {
            comentarioService.eliminarComentario(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}