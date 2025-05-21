package com.websecurity.websecurity.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

   public String register(User user) {
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
        return "Username already exists";
    }
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setRol(User.Rol.USER); // Asigna el rol USER por defecto
    userRepository.save(user);
    return "User registered successfully";
}

    public boolean authenticate(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.isPresent() && passwordEncoder.matches(rawPassword, userOpt.get().getPassword());
    }

    public String loginAndGetToken(String username, String rawPassword) {
    Optional<User> userOpt = userRepository.findByUsername(username);
    if (userOpt.isPresent() && passwordEncoder.matches(rawPassword, userOpt.get().getPassword())) {
        return jwtUtil.generateToken(username);
    }
    return null;
    }

    public Optional<User> findById(Long id) {
    return userRepository.findById(id);
    }
    public String getUsernameFromToken(String token) {
    return jwtUtil.extractUsername(token);
    }
    public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
    }
}