package com.websecurity.WebSecurity.user;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UsuarioServiceTest {

    private UserRepository userRepository;
    private JwtUtil jwtUtil;
    private EmailService emailService;
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtUtil = mock(JwtUtil.class);
        emailService = mock(EmailService.class);
        usuarioService = new UsuarioService();

        // Inyecta los mocks manualmente
        try {
            var fieldRepo = UsuarioService.class.getDeclaredField("userRepository");
            fieldRepo.setAccessible(true);
            fieldRepo.set(usuarioService, userRepository);

            var fieldJwt = UsuarioService.class.getDeclaredField("jwtUtil");
            fieldJwt.setAccessible(true);
            fieldJwt.set(usuarioService, jwtUtil);

            var fieldEmail = UsuarioService.class.getDeclaredField("emailService");
            fieldEmail.setAccessible(true);
            fieldEmail.set(usuarioService, emailService);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testRegister_Success() {
        User user = new User();
        user.setUsername("raul");
        user.setEmail("raul@mail.com");
        user.setPassword("Password1!");

        when(userRepository.findByUsername("raul")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("raul@mail.com")).thenReturn(Optional.empty());

        String result = usuarioService.register(user);

        assertEquals("Registro exitoso. Revisa tu correo para activar la cuenta.", result);
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendVerificationEmail(eq("raul@mail.com"), anyString());
    }

    @Test
    void testRegister_UsernameExists() {
        User user = new User();
        user.setUsername("raul");
        user.setEmail("raul@mail.com");
        user.setPassword("Password1!");

        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(new User()));

        String result = usuarioService.register(user);
        assertEquals("Username already exists", result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_EmailExists() {
        User user = new User();
        user.setUsername("raul");
        user.setEmail("raul@mail.com");
        user.setPassword("Password1!");

        when(userRepository.findByUsername("raul")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("raul@mail.com")).thenReturn(Optional.of(new User()));

        String result = usuarioService.register(user);
        assertEquals("Email already exists", result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_BadPassword() {
        User user = new User();
        user.setUsername("raul");
        user.setEmail("raul@mail.com");
        user.setPassword("short");

        when(userRepository.findByUsername("raul")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("raul@mail.com")).thenReturn(Optional.empty());

        String result = usuarioService.register(user);
        assertEquals("La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, número y símbolo", result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testActivateUser_Success() {
        User user = new User();
        user.setEnabled(false);
        user.setVerificationToken("token123");

        when(userRepository.findByVerificationToken("token123")).thenReturn(Optional.of(user));

        boolean result = usuarioService.activateUser("token123");
        assertTrue(result);
        assertTrue(user.isEnabled());
        assertNull(user.getVerificationToken());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testActivateUser_Fail() {
        when(userRepository.findByVerificationToken("badtoken")).thenReturn(Optional.empty());
        boolean result = usuarioService.activateUser("badtoken");
        assertFalse(result);
    }

    @Test
    void testSendPasswordReset_EmailExists() {
        User user = new User();
        user.setEmail("raul@mail.com");

        when(userRepository.findByEmail("raul@mail.com")).thenReturn(Optional.of(user));

        usuarioService.sendPasswordReset("raul@mail.com");
        verify(userRepository, times(1)).save(user);
        verify(emailService, times(1)).sendResetPasswordEmail(eq("raul@mail.com"), anyString());
        assertNotNull(user.getResetToken());
        assertNotNull(user.getResetTokenExpiry());
    }

    @Test
    void testSendPasswordReset_EmailNotExists() {
        when(userRepository.findByEmail("no@mail.com")).thenReturn(Optional.empty());
        usuarioService.sendPasswordReset("no@mail.com");
        verify(userRepository, never()).save(any());
        verify(emailService, never()).sendResetPasswordEmail(anyString(), anyString());
    }

    @Test
    void testResetPassword_Success() {
        User user = new User();
        user.setResetToken("token123");
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));

        when(userRepository.findByResetToken("token123")).thenReturn(Optional.of(user));

        boolean result = usuarioService.resetPassword("token123", "Password1!");
        assertTrue(result);
        assertNull(user.getResetToken());
        assertNull(user.getResetTokenExpiry());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testResetPassword_BadPassword() {
        User user = new User();
        user.setResetToken("token123");
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));

        when(userRepository.findByResetToken("token123")).thenReturn(Optional.of(user));

        boolean result = usuarioService.resetPassword("token123", "short");
        assertFalse(result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testResetPassword_ExpiredToken() {
        User user = new User();
        user.setResetToken("token123");
        user.setResetTokenExpiry(LocalDateTime.now().minusMinutes(1));

        when(userRepository.findByResetToken("token123")).thenReturn(Optional.of(user));

        boolean result = usuarioService.resetPassword("token123", "Password1!");
        assertFalse(result);
        verify(userRepository, never()).save(any());
    }

    @Test
    void testResetPassword_TokenNotFound() {
        when(userRepository.findByResetToken("badtoken")).thenReturn(Optional.empty());
        boolean result = usuarioService.resetPassword("badtoken", "Password1!");
        assertFalse(result);
    }

    @Test
    void testAuthenticate_Success() {
        User user = new User();
        user.setUsername("raul");
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("Password1!"));

        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));

        boolean result = usuarioService.authenticate("raul", "Password1!");
        assertTrue(result);
    }

    @Test
    void testAuthenticate_Fail() {
        when(userRepository.findByUsername("raul")).thenReturn(Optional.empty());
        boolean result = usuarioService.authenticate("raul", "Password1!");
        assertFalse(result);
    }

    @Test
    void testLoginAndGetToken_Success() {
        User user = new User();
        user.setUsername("raul");
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("Password1!"));
        user.setRol(User.Rol.USER);

        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(eq("raul"), eq(List.of("USER")))).thenReturn("token123");

        String token = usuarioService.loginAndGetToken("raul", "Password1!");
        assertEquals("token123", token);
    }

    @Test
    void testLoginAndGetToken_Fail() {
        when(userRepository.findByUsername("raul")).thenReturn(Optional.empty());
        String token = usuarioService.loginAndGetToken("raul", "Password1!");
        assertNull(token);
    }

    @Test
    void testFindById() {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Optional<User> found = usuarioService.findById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void testGetUsernameFromToken() {
        when(jwtUtil.extractUsername("token123")).thenReturn("raul");
        String username = usuarioService.getUsernameFromToken("token123");
        assertEquals("raul", username);
    }

    @Test
    void testFindByUsername() {
        User user = new User();
        user.setUsername("raul");
        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        Optional<User> found = usuarioService.findByUsername("raul");
        assertTrue(found.isPresent());
        assertEquals("raul", found.get().getUsername());
    }
}