package com.websecurity.WebSecurity.preguntaquiz;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.websecurity.websecurity.preguntaquiz.PreguntaQuizCodigo;
import com.websecurity.websecurity.preguntaquiz.PreguntaQuizCodigoController;
import com.websecurity.websecurity.preguntaquiz.PreguntaQuizCodigoService;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import static org.mockito.ArgumentMatchers.anyString;



import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PreguntaQuizCodigoController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PreguntaQuizCodigoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PreguntaQuizCodigoService service;

    @MockBean
    private com.websecurity.websecurity.user.JwtUtil jwtUtil;

    @MockBean
    private com.websecurity.websecurity.user.UserRepository userRepository;

    @MockBean
    private UsuarioService usuarioService;

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
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        pregunta.setId(1L);
        when(service.findAll()).thenReturn(Collections.singletonList(pregunta));
        mockMvc.perform(get("/api/preguntas-quiz"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById() throws Exception {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        pregunta.setId(2L);
        when(service.findById(2L)).thenReturn(Optional.of(pregunta));
        mockMvc.perform(get("/api/preguntas-quiz/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L));
    }

    @Test
    void testGetByModulo() throws Exception {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        when(service.findByModuloId(3L)).thenReturn(Collections.singletonList(pregunta));
        mockMvc.perform(get("/api/preguntas-quiz/modulo/3"))
                .andExpect(status().isOk());
    }

       @Test
    void testCreateAdmin() throws Exception {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        pregunta.setId(4L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(PreguntaQuizCodigo.class))).thenReturn(pregunta);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(pregunta);

        mockMvc.perform(post("/api/preguntas-quiz")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4L));
    }

    @Test
    void testCreateNoAdmin() throws Exception {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(pregunta);

        mockMvc.perform(post("/api/preguntas-quiz")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUpdateAdmin() throws Exception {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        pregunta.setId(5L);
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(service.save(any(PreguntaQuizCodigo.class))).thenReturn(pregunta);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(pregunta);

        mockMvc.perform(put("/api/preguntas-quiz/5")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L));
    }

    @Test
    void testUpdateNoAdmin() throws Exception {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(pregunta);

        mockMvc.perform(put("/api/preguntas-quiz/5")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    void testDeleteAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));

        mockMvc.perform(delete("/api/preguntas-quiz/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteNoAdmin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(normalUser()));

        mockMvc.perform(delete("/api/preguntas-quiz/6")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden());
    }
}