package com.websecurity.WebSecurity.glosario;

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

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.websecurity.websecurity.glosario.Termino;
import com.websecurity.websecurity.glosario.TerminoController;
import com.websecurity.websecurity.glosario.TerminoService;
import com.websecurity.websecurity.glosario.TerminoRepository;

@WebMvcTest(TerminoController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TerminoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TerminoService terminoService;

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
    void testGetAll() throws Exception {
        Termino t = new Termino();
        t.setId(1L);
        when(terminoService.findAll()).thenReturn(Collections.singletonList(t));
        mockMvc.perform(get("/api/glosario"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById() throws Exception {
        Termino t = new Termino();
        t.setId(2L);
        when(terminoService.findById(2L)).thenReturn(Optional.of(t));
        mockMvc.perform(get("/api/glosario/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testCreateAdmin() throws Exception {
        Termino t = new Termino();
        t.setId(3L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(terminoService.save(any(Termino.class))).thenReturn(t);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(t);

        mockMvc.perform(post("/api/glosario")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3L));
    }

    @Test
    void testCreateNoAdmin() throws Exception {
        Termino t = new Termino();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(t);

        mockMvc.perform(post("/api/glosario")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testUpdateAdmin() throws Exception {
        Termino t = new Termino();
        t.setId(4L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(terminoService.findById(4L)).thenReturn(Optional.of(t));
        when(terminoService.save(any(Termino.class))).thenReturn(t);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(t);

        mockMvc.perform(put("/api/glosario/4")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateNoAdmin() throws Exception {
        Termino t = new Termino();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(t);

        mockMvc.perform(put("/api/glosario/4")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testDeleteAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));

        mockMvc.perform(delete("/api/glosario/5")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteNoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(delete("/api/glosario/5")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }
}