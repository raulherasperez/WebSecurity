package com.websecurity.WebSecurity.solucion;

import com.websecurity.websecurity.solucion.Solucion;
import com.websecurity.websecurity.solucion.SolucionRepository;
import com.websecurity.websecurity.solucion.SolucionService;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.Nivel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.MockitoAnnotations;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SolucionServiceTest {

    private SolucionRepository repo;
    private SolucionService service;

    @BeforeEach
    void setUp() {
        repo = mock(SolucionRepository.class);
        service = new SolucionService();
        // Inyecta el mock manualmente
        try {
            var field = SolucionService.class.getDeclaredField("repo");
            field.setAccessible(true);
            field.set(service, repo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        Solucion s = new Solucion();
        when(repo.findAll()).thenReturn(Collections.singletonList(s));
        List<Solucion> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Solucion s = new Solucion();
        s.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(s));
        Optional<Solucion> found = service.findById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void testSave() {
        Solucion s = new Solucion();
        when(repo.save(s)).thenReturn(s);
        Solucion saved = service.save(s);
        assertEquals(s, saved);
    }

    @Test
    void testDelete() {
        service.delete(2L);
        verify(repo, times(1)).deleteById(2L);
    }

    @Test
    void testFindByModuloId() {
        Solucion s = new Solucion();
        when(repo.findByModulo_Id(3L)).thenReturn(Collections.singletonList(s));
        List<Solucion> result = service.findByModuloId(3L);
        assertEquals(1, result.size());
    }

    @Test
    void testExistsByModuloAndNivelAndTexto() {
        Modulo modulo = new Modulo();
        Nivel nivel = Nivel.FACIL;
        String texto = "texto";
        when(repo.existsByModuloAndNivelAndTexto(modulo, nivel, texto)).thenReturn(true);
        boolean exists = repo.existsByModuloAndNivelAndTexto(modulo, nivel, texto);
        assertTrue(exists);
    }
}