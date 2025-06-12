package com.websecurity.WebSecurity.guia;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.guia.Guia;
import com.websecurity.websecurity.guia.GuiaController;
import com.websecurity.websecurity.guia.GuiaService;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;
import static org.mockito.Mockito.doThrow;


import java.util.Collections;
import java.util.Optional;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(GuiaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class GuiaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GuiaService guiaService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private LogroService logroService;

    @MockBean
    private com.websecurity.websecurity.user.JwtUtil jwtUtil;

    @MockBean
    private com.websecurity.websecurity.user.UserRepository userRepository;

    @Test
    void testGetAll() throws Exception {
        Guia g = new Guia();
        g.setId(1L);
        when(guiaService.findAll()).thenReturn(Collections.singletonList(g));
        mockMvc.perform(get("/api/guias"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById() throws Exception {
        Guia g = new Guia();
        g.setId(2L);
        when(guiaService.findById(2L)).thenReturn(Optional.of(g));
        mockMvc.perform(get("/api/guias/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testCreateGuia() throws Exception {
        Guia g = new Guia();
        g.setId(3L);
        User u = new User();
        u.setUsername("raul");
        Logro logro = new Logro();
        logro.setNombre("Alma de guía");

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(guiaService.save(any(Guia.class), eq("raul"))).thenReturn(g);
        when(logroService.desbloquearLogro("raul", "Alma de guía")).thenReturn(logro);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(g);

        mockMvc.perform(post("/api/guias")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.guia.id").value(3L))
                .andExpect(jsonPath("$.logroDesbloqueado.nombre").value("Alma de guía"));
    }

    @Test
    void testUpdateGuia_Authorized() throws Exception {
        Guia g = new Guia();
        g.setId(4L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(guiaService.update(eq(4L), any(Guia.class), eq("raul"))).thenReturn(g);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(g);

        mockMvc.perform(put("/api/guias/4")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateGuia_Unauthorized() throws Exception {
        Guia g = new Guia();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("otroUsuario");
        when(guiaService.update(eq(5L), any(Guia.class), eq("otroUsuario"))).thenThrow(new SecurityException("No autorizado"));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(g);

        mockMvc.perform(put("/api/guias/5")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }

    @Test
    void testDeleteGuia_Authorized() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");

        mockMvc.perform(delete("/api/guias/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteGuia_Unauthorized() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("otroUsuario");
        doThrow(new SecurityException("No autorizado")).when(guiaService).delete(eq(7L), eq("otroUsuario"));

        mockMvc.perform(delete("/api/guias/7")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden())
                .andExpect(content().string("No autorizado"));
    }
}