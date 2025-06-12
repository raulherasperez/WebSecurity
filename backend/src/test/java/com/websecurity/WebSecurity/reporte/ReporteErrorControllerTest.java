package com.websecurity.WebSecurity.reporte;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.websecurity.websecurity.reporte.ReporteError;
import com.websecurity.websecurity.reporte.ReporteErrorService;
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
import com.websecurity.websecurity.reporte.ReporteErrorController;
import com.websecurity.websecurity.user.JwtUtil;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.reporte.ReporteErrorRepository;
import com.websecurity.websecurity.user.UsuarioService;


import java.util.Collections;
import java.util.Optional;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReporteErrorController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ReporteErrorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReporteErrorService reporteErrorService;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private LogroService logroService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private ReporteErrorRepository reporteErrorRepository;


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
        when(reporteErrorService.findAll()).thenReturn(Collections.singletonList(new ReporteError()));

        mockMvc.perform(get("/api/reportes")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAll_User() throws Exception {
        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(normalUser()));
        when(reporteErrorService.findByUsuario("raul")).thenReturn(Collections.singletonList(new ReporteError()));

        mockMvc.perform(get("/api/reportes")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

@Test
void testGetById_Admin() throws Exception {
    ReporteError r = new ReporteError();
    r.setId(1L);
    // Asigna cualquier usuario al reporte
    User anyUser = new User();
    anyUser.setUsername("alguien");
    r.setUsuario(anyUser);

    when(usuarioService.getUsernameFromToken(anyString())).thenReturn("admin");
    when(usuarioService.findByUsername("admin")).thenReturn(Optional.of(adminUser()));
    when(reporteErrorService.findById(1L)).thenReturn(Optional.of(r));

    mockMvc.perform(get("/api/reportes/1")
            .header("Authorization", "Bearer testtoken"))
            .andExpect(status().isOk());
}
    @Test
    void testGetById_User_Own() throws Exception {
        ReporteError r = new ReporteError();
        User user = normalUser();
        r.setUsuario(user);
        r.setId(2L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(user));
        when(reporteErrorService.findById(2L)).thenReturn(Optional.of(r));

        mockMvc.perform(get("/api/reportes/2")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetById_User_NotOwn() throws Exception {
        ReporteError r = new ReporteError();
        User other = new User();
        other.setUsername("otro");
        other.setRol(User.Rol.USER);
        r.setUsuario(other);
        r.setId(3L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(usuarioService.findByUsername("raul")).thenReturn(Optional.of(normalUser()));
        when(reporteErrorService.findById(3L)).thenReturn(Optional.of(r));

        mockMvc.perform(get("/api/reportes/3")
                .header("Authorization", "Bearer testtoken"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testCreateReporte() throws Exception {
        ReporteError r = new ReporteError();
        r.setId(4L);
        Logro logro = new Logro();
        logro.setNombre("Reportero");

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(reporteErrorService.save(any(ReporteError.class), eq("raul"))).thenReturn(r);
        when(logroService.desbloquearLogro("raul", "Reportero")).thenReturn(logro);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(r);

        mockMvc.perform(post("/api/reportes")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reporte.id").value(4L))
                .andExpect(jsonPath("$.logroDesbloqueado.nombre").value("Reportero"));
    }

    @Test
    void testCreateReporte_SinLogro() throws Exception {
        ReporteError r = new ReporteError();
        r.setId(5L);

        when(usuarioService.getUsernameFromToken(anyString())).thenReturn("raul");
        when(reporteErrorService.save(any(ReporteError.class), eq("raul"))).thenReturn(r);
        when(logroService.desbloquearLogro("raul", "Reportero")).thenReturn(null);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(r);

        mockMvc.perform(post("/api/reportes")
                .header("Authorization", "Bearer testtoken")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reporte.id").value(5L))
                .andExpect(jsonPath("$.logroDesbloqueado").doesNotExist());
    }
}