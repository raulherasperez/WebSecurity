package com.websecurity.WebSecurity.modulo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;


import java.util.Collections;
import java.util.Optional;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.ModuloController;
import com.websecurity.websecurity.modulo.ModuloService;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import static org.mockito.ArgumentMatchers.anyString;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ModuloController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ModuloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ModuloService moduloService;

    @MockBean
    private com.websecurity.websecurity.user.JwtUtil jwtUtil;

    @MockBean
    private com.websecurity.websecurity.user.UserRepository userRepository;

    @MockBean
    private com.websecurity.websecurity.user.UsuarioService usuarioService;




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
    void testGetAll() throws Exception {
        Modulo m = new Modulo();
        m.setId(1L);
        when(moduloService.findAll()).thenReturn(Collections.singletonList(m));
        mockMvc.perform(get("/api/modulos"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById() throws Exception {
        Modulo m = new Modulo();
        m.setId(2L);
        when(moduloService.findById(2L)).thenReturn(Optional.of(m));
        mockMvc.perform(get("/api/modulos/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testCreateAdmin() throws Exception {
        Modulo m = new Modulo();
        m.setId(3L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(moduloService.save(any(Modulo.class))).thenReturn(m);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(m);

        mockMvc.perform(post("/api/modulos")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3L));
    }

    @Test
    void testCreateNoAdmin() throws Exception {
        Modulo m = new Modulo();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(m);

        mockMvc.perform(post("/api/modulos")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUpdateAdmin() throws Exception {
        Modulo m = new Modulo();
        m.setId(4L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(moduloService.save(any(Modulo.class))).thenReturn(m);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(m);

        mockMvc.perform(put("/api/modulos/4")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4L));
    }

    @Test
    void testUpdateNoAdmin() throws Exception {
        Modulo m = new Modulo();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(m);

        mockMvc.perform(put("/api/modulos/4")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    void testDeleteAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));

        mockMvc.perform(delete("/api/modulos/5")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteNoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(delete("/api/modulos/5")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden());
    }
}