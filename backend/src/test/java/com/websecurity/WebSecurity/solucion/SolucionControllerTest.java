package com.websecurity.WebSecurity.solucion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.solucion.Solucion;
import com.websecurity.websecurity.solucion.SolucionService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.solucion.SolucionController;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.solucion.SolucionRepository;


import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SolucionController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SolucionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SolucionService service;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private SolucionRepository solucionRepository;

    

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
        Solucion s = new Solucion();
        s.setId(1L);
        when(service.findAll()).thenReturn(Collections.singletonList(s));
        mockMvc.perform(get("/api/soluciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void testGetById() throws Exception {
        Solucion s = new Solucion();
        s.setId(2L);
        when(service.findById(2L)).thenReturn(Optional.of(s));
        mockMvc.perform(get("/api/soluciones/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testGetByModulo() throws Exception {
        Solucion s = new Solucion();
        when(service.findByModuloId(3L)).thenReturn(Collections.singletonList(s));
        mockMvc.perform(get("/api/soluciones/modulo/3"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreate_Admin() throws Exception {
        Solucion s = new Solucion();
        s.setId(4L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(Solucion.class))).thenReturn(s);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);

        mockMvc.perform(post("/api/soluciones")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4L));
    }

    @Test
    void testCreate_NoAdmin() throws Exception {
        Solucion s = new Solucion();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);

        mockMvc.perform(post("/api/soluciones")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testUpdate_Admin() throws Exception {
        Solucion s = new Solucion();
        s.setId(5L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(Solucion.class))).thenReturn(s);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);

        mockMvc.perform(put("/api/soluciones/5")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L));
    }

    @Test
    void testUpdate_NoAdmin() throws Exception {
        Solucion s = new Solucion();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);

        mockMvc.perform(put("/api/soluciones/5")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testDelete_Admin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));

        mockMvc.perform(delete("/api/soluciones/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete_NoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(delete("/api/soluciones/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }
}