package com.websecurity.websecurity.sugerencia;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sugerencias")
@CrossOrigin(origins = "http://localhost:3000")
public class SugerenciaController {

    @Autowired
    private SugerenciaService sugerenciaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private LogroService logroService;

    // Listar sugerencias según rol
    @GetMapping
    public ResponseEntity<List<Sugerencia>> getAll(@RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        if (user.getRol() == User.Rol.ADMIN) {
            return ResponseEntity.ok(sugerenciaService.findAll());
        } else {
            return ResponseEntity.ok(sugerenciaService.findByUsuario(username));
        }
    }

    // Obtener sugerencia por id (solo si es propia o admin)
    @GetMapping("/{id}")
    public ResponseEntity<Sugerencia> getById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        return sugerenciaService.findById(id)
                .filter(s -> s.getUsuario().getUsername().equals(username) || user.getRol() == User.Rol.ADMIN)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }

    // Crear sugerencia (usuario autenticado)
    @PostMapping
    public ResponseEntity<?> createSugerencia(@RequestBody Sugerencia sugerencia, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        Sugerencia nueva = sugerenciaService.save(sugerencia, username);

        // Desbloquear logro "Colaborador" si es la primera vez
        Logro logroDesbloqueado = logroService.desbloquearLogro(username, "Colaborador");

        // Devuelve la sugerencia y, si corresponde, el logro desbloqueado (sin Map.of para evitar null)
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("sugerencia", nueva);
        if (logroDesbloqueado != null) {
            response.put("logroDesbloqueado", logroDesbloqueado);
        }

        return ResponseEntity.ok(response);
    }
}