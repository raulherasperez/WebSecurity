package com.websecurity.WebSecurity.pista;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;
import com.websecurity.websecurity.pista.Pista;
import com.websecurity.websecurity.pista.PistaRepository;
import com.websecurity.websecurity.pista.PistaService;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PistaServiceTest {

    private PistaRepository repo;
    private PistaService service;

    @BeforeEach
    void setUp() {
        repo = mock(PistaRepository.class);
        service = new PistaService();
        // Inyección manual si no tienes constructor
        try {
            var field = PistaService.class.getDeclaredField("repo");
            field.setAccessible(true);
            field.set(service, repo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        Pista pista = new Pista();
        when(repo.findAll()).thenReturn(Collections.singletonList(pista));
        List<Pista> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Pista pista = new Pista();
        pista.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(pista));
        Optional<Pista> result = service.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testSave() {
        Pista pista = new Pista();
        when(repo.save(pista)).thenReturn(pista);
        Pista saved = service.save(pista);
        assertEquals(pista, saved);
    }

    @Test
    void testDelete() {
        service.delete(5L);
        verify(repo, times(1)).deleteById(5L);
    }

    @Test
    void testFindByModuloId() {
        Pista pista = new Pista();
        when(repo.findByModulo_Id(2L)).thenReturn(Collections.singletonList(pista));
        List<Pista> result = service.findByModuloId(2L);
        assertEquals(1, result.size());
    }
}