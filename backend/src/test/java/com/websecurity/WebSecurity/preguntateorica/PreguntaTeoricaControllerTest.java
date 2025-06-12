package com.websecurity.WebSecurity.preguntateorica;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.preguntateorica.PreguntaTeorica;
import com.websecurity.websecurity.preguntateorica.PreguntaTeoricaService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.preguntateorica.PreguntaTeoricaController;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.preguntateorica.PreguntaTeoricaRepository;
import com.websecurity.websecurity.user.UsuarioService;

import java.util.Collections;
import java.util.Optional;



import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PreguntaTeoricaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PreguntaTeoricaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PreguntaTeoricaService service;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PreguntaTeoricaRepository preguntaTeoricaRepository;


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
        PreguntaTeorica p = new PreguntaTeorica();
        p.setId(1L);
        when(service.findAll()).thenReturn(Collections.singletonList(p));
        mockMvc.perform(get("/api/preguntas-teoricas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void testGetById() throws Exception {
        PreguntaTeorica p = new PreguntaTeorica();
        p.setId(2L);
        when(service.findById(2L)).thenReturn(Optional.of(p));
        mockMvc.perform(get("/api/preguntas-teoricas/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testGetByModulo() throws Exception {
        PreguntaTeorica p = new PreguntaTeorica();
        when(service.findByModuloId(3L)).thenReturn(Collections.singletonList(p));
        mockMvc.perform(get("/api/preguntas-teoricas/modulo/3"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreate_Admin() throws Exception {
        PreguntaTeorica p = new PreguntaTeorica();
        p.setId(4L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(PreguntaTeorica.class))).thenReturn(p);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(p);

        mockMvc.perform(post("/api/preguntas-teoricas")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4L));
    }

    @Test
    void testCreate_NoAdmin() throws Exception {
        PreguntaTeorica p = new PreguntaTeorica();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(p);

        mockMvc.perform(post("/api/preguntas-teoricas")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testUpdate_Admin() throws Exception {
        PreguntaTeorica p = new PreguntaTeorica();
        p.setId(5L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(PreguntaTeorica.class))).thenReturn(p);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(p);

        mockMvc.perform(put("/api/preguntas-teoricas/5")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L));
    }

    @Test
    void testUpdate_NoAdmin() throws Exception {
        PreguntaTeorica p = new PreguntaTeorica();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(p);

        mockMvc.perform(put("/api/preguntas-teoricas/5")
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

        mockMvc.perform(delete("/api/preguntas-teoricas/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete_NoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(delete("/api/preguntas-teoricas/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }
}