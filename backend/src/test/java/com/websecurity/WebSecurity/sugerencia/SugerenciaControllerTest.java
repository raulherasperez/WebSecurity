package com.websecurity.WebSecurity.sugerencia;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.sugerencia.Sugerencia;
import com.websecurity.websecurity.sugerencia.SugerenciaService;
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
import com.websecurity.websecurity.sugerencia.SugerenciaController;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;


import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SugerenciaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SugerenciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SugerenciaService sugerenciaService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private LogroService logroService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    

    private User adminUser() {
        User u = new User();
        u.setRol(User.Rol.ROLE_ADMIN);
        u.setUsername("admin");
        return u;
    }

    private User normalUser() {
        User u = new User();
        u.setRol(User.Rol.USER);
        u.setUsername("raul");
        return u;
    }

    @Test
    void testGetAll_Admin() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
        when(sugerenciaService.findAll()).thenReturn(Collections.singletonList(new Sugerencia()));

        mockMvc.perform(get("/api/sugerencias")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAll_User() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(normalUser()));
        when(sugerenciaService.findByUsuario("raul")).thenReturn(Collections.singletonList(new Sugerencia()));

        mockMvc.perform(get("/api/sugerencias")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById_Admin() throws Exception {
        Sugerencia s = new Sugerencia();
        User admin = adminUser();
        s.setUsuario(admin);
        s.setId(1L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
        when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(admin));
        when(sugerenciaService.findById(1L)).thenReturn(Optional.of(s));

        mockMvc.perform(get("/api/sugerencias/1")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById_User_Own() throws Exception {
        Sugerencia s = new Sugerencia();
        User user = normalUser();
        s.setUsuario(user);
        s.setId(2L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(user));
        when(sugerenciaService.findById(2L)).thenReturn(Optional.of(s));

        mockMvc.perform(get("/api/sugerencias/2")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById_User_NotOwn() throws Exception {
        Sugerencia s = new Sugerencia();
        User other = new User();
        other.setUsername("otro");
        other.setRol(User.Rol.USER);
        s.setUsuario(other);
        s.setId(3L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(normalUser()));
        when(sugerenciaService.findById(3L)).thenReturn(Optional.of(s));

        mockMvc.perform(get("/api/sugerencias/3")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testCreateSugerencia() throws Exception {
        Sugerencia s = new Sugerencia();
        s.setId(4L);
        Logro logro = new Logro();
        logro.setNombre("Colaborador");

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(sugerenciaService.save(any(Sugerencia.class), eq("raul"))).thenReturn(s);
        when(logroService.desbloquearLogro("raul", "Colaborador")).thenReturn(logro);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);

        mockMvc.perform(post("/api/sugerencias")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sugerencia.id").value(4L))
                .andExpect(jsonPath("$.logroDesbloqueado.nombre").value("Colaborador"));
    }

    @Test
    void testCreateSugerencia_SinLogro() throws Exception {
        Sugerencia s = new Sugerencia();
        s.setId(5L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(sugerenciaService.save(any(Sugerencia.class), eq("raul"))).thenReturn(s);
        when(logroService.desbloquearLogro("raul", "Colaborador")).thenReturn(null);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);

        mockMvc.perform(post("/api/sugerencias")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sugerencia.id").value(5L))
                .andExpect(jsonPath("$.logroDesbloqueado").doesNotExist());
    }
}