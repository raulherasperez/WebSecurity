package com.websecurity.WebSecurity.sugerencia;

import com.websecurity.websecurity.sugerencia.Sugerencia;
import com.websecurity.websecurity.sugerencia.SugerenciaRepository;
import com.websecurity.websecurity.sugerencia.SugerenciaService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SugerenciaServiceTest {

    private SugerenciaRepository sugerenciaRepository;
    private UserRepository userRepository;
    private SugerenciaService sugerenciaService;

    @BeforeEach
    void setUp() {
        sugerenciaRepository = mock(SugerenciaRepository.class);
        userRepository = mock(UserRepository.class);
        sugerenciaService = new SugerenciaService();

        // Inyecta los mocks manualmente
        try {
            var fieldSugerencia = SugerenciaService.class.getDeclaredField("sugerenciaRepository");
            fieldSugerencia.setAccessible(true);
            fieldSugerencia.set(sugerenciaService, sugerenciaRepository);

            var fieldUser = SugerenciaService.class.getDeclaredField("userRepository");
            fieldUser.setAccessible(true);
            fieldUser.set(sugerenciaService, userRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        Sugerencia s = new Sugerencia();
        when(sugerenciaRepository.findAll()).thenReturn(Collections.singletonList(s));
        List<Sugerencia> result = sugerenciaService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindByUsuario() {
        Sugerencia s = new Sugerencia();
        when(sugerenciaRepository.findByUsuarioUsername("raul")).thenReturn(Collections.singletonList(s));
        List<Sugerencia> result = sugerenciaService.findByUsuario("raul");
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Sugerencia s = new Sugerencia();
        s.setId(1L);
        when(sugerenciaRepository.findById(1L)).thenReturn(Optional.of(s));
        Optional<Sugerencia> found = sugerenciaService.findById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void testSave() {
        User user = new User();
        user.setUsername("raul");
        Sugerencia s = new Sugerencia();
        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(sugerenciaRepository.save(any(Sugerencia.class))).thenAnswer(inv -> inv.getArgument(0));

        Sugerencia saved = sugerenciaService.save(s, "raul");
        assertEquals(user, saved.getUsuario());
        assertNotNull(saved.getFechaPublicacion());
    }
}