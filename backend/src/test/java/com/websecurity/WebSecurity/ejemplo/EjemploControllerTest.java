package com.websecurity.WebSecurity.ejemplo;

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
import com.websecurity.websecurity.modulo.Nivel;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.ejemplo.Ejemplo;
import com.websecurity.websecurity.ejemplo.EjemploController;
import com.websecurity.websecurity.ejemplo.EjemploService;
import com.websecurity.websecurity.ejemplo.EjemploRepository;


import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EjemploController.class)
@AutoConfigureMockMvc(addFilters = false)
public class EjemploControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EjemploService ejemploService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private EjemploRepository ejemploRepository;
    

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
        Ejemplo ejemplo = new Ejemplo();
        ejemplo.setId(1L);
        when(ejemploService.findAll()).thenReturn(Collections.singletonList(ejemplo));
        mockMvc.perform(get("/api/ejemplos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void testGetById() throws Exception {
        Ejemplo ejemplo = new Ejemplo();
        ejemplo.setId(2L);
        when(ejemploService.findById(2L)).thenReturn(Optional.of(ejemplo));
        mockMvc.perform(get("/api/ejemplos/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testGetByModulo() throws Exception {
        Ejemplo ejemplo = new Ejemplo();
        when(ejemploService.findByModuloId(3L)).thenReturn(Collections.singletonList(ejemplo));
        mockMvc.perform(get("/api/ejemplos/modulo/3"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreate_Admin() throws Exception {
        Ejemplo ejemplo = new Ejemplo();
        ejemplo.setId(4L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(ejemploService.save(any(Ejemplo.class))).thenReturn(ejemplo);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(ejemplo);

        mockMvc.perform(post("/api/ejemplos")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4L));
    }

    @Test
    void testCreate_NoAdmin() throws Exception {
        Ejemplo ejemplo = new Ejemplo();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(ejemplo);

        mockMvc.perform(post("/api/ejemplos")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testUpdate_Admin() throws Exception {
        Ejemplo ejemplo = new Ejemplo();
        ejemplo.setId(5L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(ejemploService.save(any(Ejemplo.class))).thenReturn(ejemplo);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(ejemplo);

        mockMvc.perform(put("/api/ejemplos/5")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L));
    }

    @Test
    void testUpdate_NoAdmin() throws Exception {
        Ejemplo ejemplo = new Ejemplo();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(ejemplo);

        mockMvc.perform(put("/api/ejemplos/5")
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

        mockMvc.perform(delete("/api/ejemplos/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDelete_NoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(delete("/api/ejemplos/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }
}