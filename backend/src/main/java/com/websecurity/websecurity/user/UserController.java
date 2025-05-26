package com.websecurity.websecurity.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String result = usuarioService.register(user);
        if (result.equals("User registered successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        String token = usuarioService.loginAndGetToken(user.getUsername(), user.getPassword());
        if (token != null) {
            return ResponseEntity.ok().body("{\"token\": \"" + token + "\"}");
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = usuarioService.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(null); // Never expose the password
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = usuarioService.getUsernameFromToken(token);
            Optional<User> userOpt = usuarioService.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setPassword(null);
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body("Invalid token");
    }

    @PutMapping(value = "/me", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart(required = false) String username,
            @RequestPart(required = false) String email,
            @RequestPart(required = false) MultipartFile foto
    ) {
        String token = authHeader.replace("Bearer ", "");
        String currentUsername = usuarioService.getUsernameFromToken(token);
        User user = userRepository.findByUsername(currentUsername).orElseThrow();

        if (username != null && !username.isBlank()) user.setUsername(username);
        if (email != null && !email.isBlank()) user.setEmail(email);
        if (foto != null && !foto.isEmpty()) {
            try {
                user.setFoto(foto.getBytes());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Error al procesar la imagen");
            }
        }
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}