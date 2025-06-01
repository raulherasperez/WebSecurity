package com.websecurity.websecurity.vm;

import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroService;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/vms")
@CrossOrigin(origins = "http://localhost:3000")
public class VirtualMachineController {

    @Autowired
    private VirtualMachineService vmService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private LogroService logroService;

    // Obtener todas las máquinas virtuales (público)
    @GetMapping
    public List<VirtualMachine> getAll() {
        return vmService.findAll();
    }

    // Obtener una máquina virtual por id (público)
    @GetMapping("/{id}")
    public ResponseEntity<VirtualMachine> getById(@PathVariable Long id) {
        return vmService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear máquina virtual (usuario autenticado)
    @PostMapping
    public ResponseEntity<?> createVM(@RequestBody VirtualMachine vm, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        VirtualMachine nueva = vmService.save(vm, username);

        // Desbloquear logro "¿Cómo estan los máquinas?" si es la primera vez
        Logro logroDesbloqueado = logroService.desbloquearLogro(username, "¿Cómo estan los máquinas?");

        // Devuelve la máquina y, si corresponde, el logro desbloqueado
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("vm", nueva);
        if (logroDesbloqueado != null) {
            response.put("logroDesbloqueado", logroDesbloqueado);
        }

        return ResponseEntity.ok(response);
    }

    // Editar máquina virtual (solo autor)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVM(@PathVariable Long id, @RequestBody VirtualMachine vm, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        try {
            VirtualMachine actualizada = vmService.update(id, vm, username);
            return ResponseEntity.ok(actualizada);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }

    // Borrar máquina virtual (autor, admin o moderador)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVM(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String username = usuarioService.getUsernameFromToken(authHeader.replace("Bearer ", ""));
        User user = usuarioService.findByUsername(username).orElseThrow();
        try {
            vmService.delete(id, user);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("No autorizado");
        }
    }
}