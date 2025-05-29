package com.websecurity.websecurity.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class UsuarioService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

   public String register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists";
        }
        if (!user.getPassword().matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$")) {
            return "La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, número y símbolo";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRol(User.Rol.USER);
        user.setEnabled(false);
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), token);
        return "Registro exitoso. Revisa tu correo para activar la cuenta.";
    }

    public boolean activateUser(String token) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEnabled(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void sendPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);
            emailService.sendResetPasswordEmail(user.getEmail(), token);
        }
    }

    public boolean resetPassword(String token, String newPassword) {
    // Validación de complejidad de contraseña igual que en register
    if (!newPassword.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$")) {
        return false;
    }
    Optional<User> userOpt = userRepository.findByResetToken(token);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        if (user.getResetTokenExpiry() != null && user.getResetTokenExpiry().isAfter(LocalDateTime.now())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            return true;
        }
    }
    return false;
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