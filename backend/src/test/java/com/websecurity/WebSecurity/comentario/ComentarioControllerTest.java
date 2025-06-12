package com.websecurity.WebSecurity.comentario;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.comentario.Comentario;
import com.websecurity.websecurity.comentario.ComentarioService;
import com.websecurity.websecurity.comentario.ComentarioController;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UsuarioService;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.user.JwtUtil;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import java.util.Optional;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ComentarioController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ComentarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ComentarioService comentarioService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @Test
    void testGetComentarios() throws Exception {
        Modulo modulo = new Modulo();
        modulo.setId(1L);
        Comentario comentario = new Comentario();
        comentario.setModulo(modulo);
        comentario.setTexto("Test comentario");

        when(comentarioService.getComentariosPorModulo(1L))
                .thenReturn(Collections.singletonList(comentario));

        mockMvc.perform(get("/api/comentarios/modulo/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].texto").value("Test comentario"));
    }

    @Test
    void testCrearComentario() throws Exception {
        Modulo modulo = new Modulo();
        modulo.setId(2L);
        Comentario comentario = new Comentario();
        comentario.setModulo(modulo);
        comentario.setTexto("Nuevo comentario");

        when(usuarioService.getUsernameFromToken(any())).thenReturn("testuser");
        when(comentarioService.crearComentario(2L, "Nuevo comentario", "testuser")).thenReturn(comentario);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(comentario);

        mockMvc.perform(post("/api/comentarios")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.texto").value("Nuevo comentario"));
    }

    @Test
    void testEliminarComentarioAutorizado() throws Exception {
        User user = new User();
        user.setRol(User.Rol.ROLE_ADMIN);

        when(usuarioService.getUsernameFromToken(any())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(user));

        mockMvc.perform(delete("/api/comentarios/5")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testEliminarComentarioNoAutorizado() throws Exception {
        User user = new User();
        user.setRol(User.Rol.USER);

        when(usuarioService.getUsernameFromToken(any())).thenReturn("user");
        when(usuarioService.findByUsername("user")).thenReturn(Optional.of(user));

        mockMvc.perform(delete("/api/comentarios/5")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden());
    }
}