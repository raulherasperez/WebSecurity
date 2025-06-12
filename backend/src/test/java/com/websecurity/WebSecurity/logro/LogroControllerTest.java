package com.websecurity.WebSecurity.logro;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroService;
import com.websecurity.websecurity.logro.LogroController;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;


import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LogroController.class)
@AutoConfigureMockMvc(addFilters = false)
public class LogroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LogroService logroService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private com.websecurity.websecurity.user.JwtUtil jwtUtil;

    @MockBean
    private com.websecurity.websecurity.user.UserRepository userRepository;

    private User adminUser() {
        User u = new User();
        u.setRol(User.Rol.ROLE_ADMIN);
        return u;
    }

    private User normalUser() {
        User u = new User();
        u.setRol(User.Rol.USER);
        return u;
    }

    @Test
    void testGetAll_Admin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(logroService.findAll()).thenReturn(Collections.singletonList(new Logro()));

        mockMvc.perform(get("/api/logros")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAll_NoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(get("/api/logros")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testCreate_Admin() throws Exception {
        Logro logro = new Logro();
        logro.setId(1L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(logroService.create(any(Logro.class))).thenReturn(logro);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(logro);

        mockMvc.perform(post("/api/logros")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testCreate_NoAdmin() throws Exception {
        Logro logro = new Logro();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(logro);

        mockMvc.perform(post("/api/logros")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testUpdate_Admin() throws Exception {
        Logro logro = new Logro();
        logro.setId(2L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(logroService.update(eq(2L), any(Logro.class))).thenReturn(logro);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(logro);

        mockMvc.perform(put("/api/logros/2")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete_Admin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));

        mockMvc.perform(delete("/api/logros/3")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetLogrosDesbloqueados() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(logroService.getLogrosDesbloqueados("raul")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/logros/usuario/desbloqueados")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetLogrosPendientes() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(logroService.getLogrosPendientes("raul")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/logros/usuario/pendientes")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDesbloquearLogro() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        Logro logro = new Logro();
        logro.setNombre("Test");
        when(logroService.desbloquearLogro("raul", "Test")).thenReturn(logro);

        mockMvc.perform(post("/api/logros/usuario/desbloquear")
                .header("Authorization", "Bearer testtoken")
                .param("nombreLogro", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Test"));
    }
}