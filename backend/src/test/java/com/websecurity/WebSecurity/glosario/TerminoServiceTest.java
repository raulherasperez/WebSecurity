package com.websecurity.WebSecurity.glosario;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.websecurity.websecurity.glosario.Termino;
import com.websecurity.websecurity.glosario.TerminoRepository;
import com.websecurity.websecurity.glosario.TerminoService;

public class TerminoServiceTest {

    private TerminoRepository repo;
    private TerminoService service;

    @BeforeEach
    void setUp() {
        repo = mock(TerminoRepository.class);
        service = new TerminoService();
        // Inyecta el mock manualmente si no tienes constructor
        java.lang.reflect.Field field = null;
        try {
            field = TerminoService.class.getDeclaredField("terminoRepository");
            field.setAccessible(true);
            field.set(service, repo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        Termino t = new Termino();
        when(repo.findAll()).thenReturn(Collections.singletonList(t));
        List<Termino> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Termino t = new Termino();
        t.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(t));
        Optional<Termino> result = service.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testSave() {
        Termino t = new Termino();
        when(repo.save(t)).thenReturn(t);
        Termino saved = service.save(t);
        assertEquals(t, saved);
    }

    @Test
    void testDelete() {
        service.delete(5L);
        verify(repo, times(1)).deleteById(5L);
    }
}