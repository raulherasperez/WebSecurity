package com.websecurity.WebSecurity.modulo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.ModuloRepository;
import com.websecurity.websecurity.modulo.ModuloService;
import org.mockito.Mockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.BeforeEach;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ModuloServiceTest {

    private ModuloRepository moduloRepository;
    private ModuloService moduloService;

    @BeforeEach
    void setUp() {
        moduloRepository = mock(ModuloRepository.class);
        moduloService = new ModuloService(moduloRepository);
    }

    @Test
    void testFindAll() {
        Modulo m = new Modulo();
        when(moduloRepository.findAll()).thenReturn(Collections.singletonList(m));
        List<Modulo> result = moduloService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Modulo m = new Modulo();
        m.setId(1L);
        when(moduloRepository.findById(1L)).thenReturn(Optional.of(m));
        Optional<Modulo> result = moduloService.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testSave() {
        Modulo m = new Modulo();
        when(moduloRepository.save(m)).thenReturn(m);
        Modulo saved = moduloService.save(m);
        assertEquals(m, saved);
    }

    @Test
    void testDeleteById() {
        moduloService.deleteById(5L);
        verify(moduloRepository, times(1)).deleteById(5L);
    }
}