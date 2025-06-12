package com.websecurity.WebSecurity.descripciontecnica;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnica;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnicaRepository;
import com.websecurity.websecurity.descripciontecnica.DescripcionTecnicaService;
import com.websecurity.websecurity.modulo.Nivel;

public class DescripcionTecnicaServiceTest {

    private DescripcionTecnicaRepository repo;
    private DescripcionTecnicaService service;

    @BeforeEach
    void setUp() {
        repo = mock(DescripcionTecnicaRepository.class);
        service = new DescripcionTecnicaService(repo);
    }

    @Test
    void testFindAll() {
        DescripcionTecnica d = new DescripcionTecnica();
        when(repo.findAll()).thenReturn(Collections.singletonList(d));
        List<DescripcionTecnica> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        DescripcionTecnica d = new DescripcionTecnica();
        d.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(d));
        Optional<DescripcionTecnica> result = service.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testFindByModuloId() {
        DescripcionTecnica d = new DescripcionTecnica();
        when(repo.findByModuloId(2L)).thenReturn(Collections.singletonList(d));
        List<DescripcionTecnica> result = service.findByModuloId(2L);
        assertEquals(1, result.size());
    }

    @Test
    void testFindByModuloIdAndNivel() {
        DescripcionTecnica d = new DescripcionTecnica();
        when(repo.findByModuloIdAndNivel(2L, com.websecurity.websecurity.modulo.Nivel.FACIL))
            .thenReturn(Collections.singletonList(d));
        List<DescripcionTecnica> result = service.findByModuloIdAndNivel(2L, com.websecurity.websecurity.modulo.Nivel.FACIL);
        assertEquals(1, result.size());
    }

    @Test
    void testSave() {
        DescripcionTecnica d = new DescripcionTecnica();
        when(repo.save(d)).thenReturn(d);
        DescripcionTecnica saved = service.save(d);
        assertEquals(d, saved);
    }

    @Test
    void testDeleteById() {
        service.deleteById(5L);
        verify(repo, times(1)).deleteById(5L);
    }
}