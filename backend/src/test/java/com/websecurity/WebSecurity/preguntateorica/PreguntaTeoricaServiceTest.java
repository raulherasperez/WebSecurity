package com.websecurity.WebSecurity.preguntateorica;

import com.websecurity.websecurity.preguntateorica.PreguntaTeorica;
import com.websecurity.websecurity.preguntateorica.PreguntaTeoricaRepository;
import com.websecurity.websecurity.preguntateorica.PreguntaTeoricaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Optional;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PreguntaTeoricaServiceTest {

    private PreguntaTeoricaRepository repo;
    private PreguntaTeoricaService service;

    @BeforeEach
    void setUp() {
        repo = mock(PreguntaTeoricaRepository.class);
        service = new PreguntaTeoricaService();
        // Inyecta el mock manualmente
        try {
            var field = PreguntaTeoricaService.class.getDeclaredField("repo");
            field.setAccessible(true);
            field.set(service, repo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        PreguntaTeorica p = new PreguntaTeorica();
        when(repo.findAll()).thenReturn(Collections.singletonList(p));
        List<PreguntaTeorica> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        PreguntaTeorica p = new PreguntaTeorica();
        p.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(p));
        Optional<PreguntaTeorica> found = service.findById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void testSave() {
        PreguntaTeorica p = new PreguntaTeorica();
        when(repo.save(p)).thenReturn(p);
        PreguntaTeorica saved = service.save(p);
        assertEquals(p, saved);
    }

    @Test
    void testDelete() {
        service.delete(2L);
        verify(repo, times(1)).deleteById(2L);
    }

    @Test
    void testFindByModuloId() {
        PreguntaTeorica p = new PreguntaTeorica();
        when(repo.findByModulo_Id(3L)).thenReturn(Collections.singletonList(p));
        List<PreguntaTeorica> result = service.findByModuloId(3L);
        assertEquals(1, result.size());
    }
}