package com.websecurity.WebSecurity.ejemplo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.websecurity.websecurity.ejemplo.Ejemplo;
import com.websecurity.websecurity.ejemplo.EjemploRepository;
import com.websecurity.websecurity.ejemplo.EjemploService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class EjemploServiceTest {
    @Mock
    private EjemploRepository repo;

    @InjectMocks
    private EjemploService service;


    @Test
    void testFindAll() {
        Ejemplo ejemplo = new Ejemplo();
        when(repo.findAll()).thenReturn(Collections.singletonList(ejemplo));
        List<Ejemplo> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Ejemplo ejemplo = new Ejemplo();
        ejemplo.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(ejemplo));
        Optional<Ejemplo> result = service.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testFindByModuloId() {
        Ejemplo ejemplo = new Ejemplo();
        when(repo.findByModulo_Id(2L)).thenReturn(Collections.singletonList(ejemplo));
        List<Ejemplo> result = service.findByModuloId(2L);
        assertEquals(1, result.size());
    }

    @Test
    void testSave() {
        Ejemplo ejemplo = new Ejemplo();
        when(repo.save(ejemplo)).thenReturn(ejemplo);
        Ejemplo saved = service.save(ejemplo);
        assertEquals(ejemplo, saved);
    }

    @Test
    void testDeleteById() {
        service.delete(5L);
        verify(repo, times(1)).deleteById(5L);
    }
}