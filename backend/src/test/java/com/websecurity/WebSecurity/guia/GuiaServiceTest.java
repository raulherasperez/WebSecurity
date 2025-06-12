package com.websecurity.WebSecurity.guia;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.websecurity.websecurity.guia.Guia;
import com.websecurity.websecurity.guia.GuiaRepository;
import com.websecurity.websecurity.guia.GuiaService;
import com.websecurity.websecurity.user.JwtUtil;
import org.mockito.Mockito;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GuiaServiceTest {

    private GuiaRepository guiaRepository;
    private UserRepository userRepository;
    private GuiaService guiaService;

    @BeforeEach
    void setUp() {
        guiaRepository = mock(GuiaRepository.class);
        userRepository = mock(UserRepository.class);
        guiaService = new GuiaService();
        // Inyecta los mocks manualmente
        try {
            var fieldGuia = GuiaService.class.getDeclaredField("guiaRepository");
            fieldGuia.setAccessible(true);
            fieldGuia.set(guiaService, guiaRepository);

            var fieldUser = GuiaService.class.getDeclaredField("userRepository");
            fieldUser.setAccessible(true);
            fieldUser.set(guiaService, userRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        Guia g = new Guia();
        when(guiaRepository.findAll()).thenReturn(Collections.singletonList(g));
        List<Guia> result = guiaService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Guia g = new Guia();
        g.setId(1L);
        when(guiaRepository.findById(1L)).thenReturn(Optional.of(g));
        Optional<Guia> result = guiaService.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testSave() {
        Guia g = new Guia();
        User u = new User();
        u.setUsername("raul");
        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(u));
        when(guiaRepository.save(any(Guia.class))).thenReturn(g);

        Guia saved = guiaService.save(g, "raul");
        assertEquals(g, saved);
        assertEquals(u, g.getUsuario());
        assertNotNull(g.getFechaAñadida());
    }

    @Test
    void testUpdate_Authorized() {
        Guia g = new Guia();
        g.setId(2L);
        User u = new User();
        u.setUsername("raul");
        g.setUsuario(u);

        Guia datos = new Guia();
        datos.setTitulo("Nuevo título");
        datos.setContenido("Nuevo contenido");

        when(guiaRepository.findById(2L)).thenReturn(Optional.of(g));
        when(guiaRepository.save(any(Guia.class))).thenReturn(g);

        Guia updated = guiaService.update(2L, datos, "raul");
        assertEquals("Nuevo título", updated.getTitulo());
        assertEquals("Nuevo contenido", updated.getContenido());
    }

    @Test
    void testUpdate_Unauthorized() {
        Guia g = new Guia();
        g.setId(3L);
        User u = new User();
        u.setUsername("raul");
        g.setUsuario(u);

        Guia datos = new Guia();
        datos.setTitulo("Nuevo título");

        when(guiaRepository.findById(3L)).thenReturn(Optional.of(g));

        assertThrows(SecurityException.class, () -> {
            guiaService.update(3L, datos, "otroUsuario");
        });
    }

    @Test
    void testDelete_Authorized() {
        Guia g = new Guia();
        g.setId(4L);
        User u = new User();
        u.setUsername("raul");
        g.setUsuario(u);

        when(guiaRepository.findById(4L)).thenReturn(Optional.of(g));

        guiaService.delete(4L, "raul");
        verify(guiaRepository, times(1)).delete(g);
    }

    @Test
    void testDelete_Unauthorized() {
        Guia g = new Guia();
        g.setId(5L);
        User u = new User();
        u.setUsername("raul");
        g.setUsuario(u);

        when(guiaRepository.findById(5L)).thenReturn(Optional.of(g));

        assertThrows(SecurityException.class, () -> {
            guiaService.delete(5L, "otroUsuario");
        });
    }
}