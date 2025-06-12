package com.websecurity.WebSecurity.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.user.UserController;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;


import java.util.Optional;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtil jwtUtil;

    

    @Test
    void testRegister_Success() throws Exception {
        User user = new User();
        user.setUsername("raul");
        user.setEmail("raul@mail.com");
        user.setPassword("Password1!");

        when(usuarioService.register(any(User.class))).thenReturn("Registro exitoso. Revisa tu correo para activar la cuenta.");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(user);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Registro exitoso. Revisa tu correo para activar la cuenta."));
    }

    @Test
    void testRegister_UsernameExists() throws Exception {
        User user = new User();
        user.setUsername("raul");
        user.setEmail("raul@mail.com");
        user.setPassword("Password1!");

        when(usuarioService.register(any(User.class))).thenReturn("Username already exists");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(user);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username already exists"));
    }

    @Test
    void testLogin_Success() throws Exception {
        User user = new User();
        user.setUsername("raul");
        user.setPassword("Password1!");

        when(usuarioService.loginAndGetToken(eq("raul"), eq("Password1!"))).thenReturn("token123");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(user);

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"token\": \"token123\"}"));
    }

    @Test
    void testLogin_Fail() throws Exception {
        User user = new User();
        user.setUsername("raul");
        user.setPassword("wrong");

        when(usuarioService.loginAndGetToken(eq("raul"), eq("wrong"))).thenReturn(null);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(user);

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Credenciales inválidas"));
    }

    @Test
    void testGetUserById_Found() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("raul");
        user.setPassword("Password1!");

        when(usuarioService.findById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("raul"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void testGetUserById_NotFound() throws Exception {
        when(usuarioService.findById(2L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetCurrentUser_ValidToken() throws Exception {
        User user = new User();
        user.setUsername("raul");
        user.setPassword("Password1!");

        when(usuarioService.getUsernameFromToken("token123")).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer token123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("raul"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void testGetCurrentUser_InvalidToken() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer invalid"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid token"));
    }

    @Test
    void testVerify_Success() throws Exception {
        when(usuarioService.activateUser("token123")).thenReturn(true);

        mockMvc.perform(get("/api/users/verify")
                .param("token", "token123"))
                .andExpect(status().isOk())
                .andExpect(content().string("Cuenta activada correctamente."));
    }

    @Test
    void testVerify_Fail() throws Exception {
        when(usuarioService.activateUser("badtoken")).thenReturn(false);

        mockMvc.perform(get("/api/users/verify")
                .param("token", "badtoken"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Token inválido."));
    }

    @Test
    void testForgotPassword() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(Map.of("email", "raul@mail.com"));

        mockMvc.perform(post("/api/users/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Si el email existe, recibirás instrucciones para restablecer tu contraseña."));
    }

    @Test
    void testResetPassword_Success() throws Exception {
        when(usuarioService.resetPassword("token123", "Password1!")).thenReturn(true);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(Map.of("token", "token123", "newPassword", "Password1!"));

        mockMvc.perform(post("/api/users/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Contraseña restablecida correctamente."));
    }

    @Test
    void testResetPassword_BadPassword() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(Map.of("token", "token123", "newPassword", "short"));

        mockMvc.perform(post("/api/users/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, número y símbolo"));
    }

    @Test
    void testResetPassword_BadToken() throws Exception {
        when(usuarioService.resetPassword("badtoken", "Password1!")).thenReturn(false);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(Map.of("token", "badtoken", "newPassword", "Password1!"));

        mockMvc.perform(post("/api/users/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Token inválido o expirado."));
    }
@Test
void testUpdateProfile_Success() throws Exception {
    User user = new User();
    user.setUsername("raul");
    user.setEmail("raul@mail.com");
    user.setPassword("Password1!");
    user.setId(1L);

    when(usuarioService.getUsernameFromToken("token123")).thenReturn("raul");
    // Simula que después de guardar, el usuario tiene los datos nuevos
    when(userRepository.findByUsername(anyString())).thenAnswer(invocation -> {
        User u = new User();
        u.setId(1L);
        u.setUsername("raul_nuevo");
        u.setEmail("nuevo@mail.com");
        u.setPassword("Password1!");
        return Optional.of(u);
    });
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    mockMvc.perform(multipart("/api/users/me")
            .file("foto", "fakeimage".getBytes())
            .param("username", "raul_nuevo")
            .param("email", "nuevo@mail.com")
            .header("Authorization", "Bearer token123")
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .with(request -> { request.setMethod("PUT"); return request; }))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("raul_nuevo"))
            .andExpect(jsonPath("$.email").value("nuevo@mail.com"));
}
}