package com.websecurity.websecurity;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.guia.Guia;
import com.websecurity.websecurity.guia.GuiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GuiaRepository guiaRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        // Usuarios normales
        createUserIfNotExists("user1", "user1@websec.com", "user1pass", User.Rol.USER);
        createUserIfNotExists("user2", "user2@websec.com", "user2pass", User.Rol.USER);
        createUserIfNotExists("user3", "user3@websec.com", "user3pass", User.Rol.USER);

        // Admin
        createUserIfNotExists("admin", "admin@websec.com", "adminpass", User.Rol.ADMIN);

        // Moderador
        createUserIfNotExists("moderator", "moderator@websec.com", "modpass", User.Rol.MODERATOR);

        // Guías de prueba para cada usuario con rol USER
        createGuiaIfNotExists("user1", "Guía de prueba 1", "Contenido de la guía de prueba 1.");
        createGuiaIfNotExists("user2", "Guía de prueba 2", "Contenido de la guía de prueba 2.");
        createGuiaIfNotExists("user3", "Guía de prueba 3", "Contenido de la guía de prueba 3.");
    }

    private void createUserIfNotExists(String username, String email, String rawPassword, User.Rol rol) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRol(rol);
            userRepository.save(user);
        }
    }

    private void createGuiaIfNotExists(String username, String titulo, String contenido) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && guiaRepository.findByTituloAndUsuario(titulo, user).isEmpty()) {
            Guia guia = new Guia();
            guia.setTitulo(titulo);
            guia.setContenido(contenido);
            guia.setFechaAñadida(new Date());
            guia.setUsuario(user);
            guiaRepository.save(guia);
        }
    }
}