package com.websecurity.WebSecurity.descripciontecnica;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.modulo.Nivel;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnica;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnicaController;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnicaService;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnicaRepository;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;


import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DescripcionTecnicaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class DescripcionTecnicaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DescripcionTecnicaService service;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private DescripcionTecnicaRepository descripcionTecnicaRepository;

    

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
        DescripcionTecnica d = new DescripcionTecnica();
        d.setId(1L);
        when(service.findAll()).thenReturn(Collections.singletonList(d));
        mockMvc.perform(get("/api/descripciones-tecnicas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void testGetById() throws Exception {
        DescripcionTecnica d = new DescripcionTecnica();
        d.setId(2L);
        when(service.findById(2L)).thenReturn(Optional.of(d));
        mockMvc.perform(get("/api/descripciones-tecnicas/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testGetByModulo() throws Exception {
        DescripcionTecnica d = new DescripcionTecnica();
        when(service.findByModuloId(3L)).thenReturn(Collections.singletonList(d));
        mockMvc.perform(get("/api/descripciones-tecnicas/modulo/3"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetByModuloAndNivel() throws Exception {
        DescripcionTecnica d = new DescripcionTecnica();
        when(service.findByModuloIdAndNivel(4L, Nivel.FACIL)).thenReturn(Collections.singletonList(d));
        mockMvc.perform(get("/api/descripciones-tecnicas/modulo/4/nivel/FACIL"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreate_Admin() throws Exception {
        DescripcionTecnica d = new DescripcionTecnica();
        d.setId(5L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(DescripcionTecnica.class))).thenReturn(d);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(d);

        mockMvc.perform(post("/api/descripciones-tecnicas")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L));
    }

    @Test
    void testCreate_NoAdmin() throws Exception {
        DescripcionTecnica d = new DescripcionTecnica();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(d);

        mockMvc.perform(post("/api/descripciones-tecnicas")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testUpdate_Admin() throws Exception {
        DescripcionTecnica d = new DescripcionTecnica();
        d.setId(6L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(DescripcionTecnica.class))).thenReturn(d);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(d);

        mockMvc.perform(put("/api/descripciones-tecnicas/6")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(6L));
    }

    @Test
    void testUpdate_NoAdmin() throws Exception {
        DescripcionTecnica d = new DescripcionTecnica();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(d);

        mockMvc.perform(put("/api/descripciones-tecnicas/6")
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

        mockMvc.perform(delete("/api/descripciones-tecnicas/7")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete_NoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(delete("/api/descripciones-tecnicas/7")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }
}