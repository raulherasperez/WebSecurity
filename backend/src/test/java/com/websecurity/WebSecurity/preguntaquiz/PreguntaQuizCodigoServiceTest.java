package com.websecurity.WebSecurity.preguntaquiz;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;
import java.util.List;
import com.websecurity.websecurity.preguntaquiz.PreguntaQuizCodigo;
import com.websecurity.websecurity.preguntaquiz.PreguntaQuizCodigoRepository;
import com.websecurity.websecurity.preguntaquiz.PreguntaQuizCodigoService;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PreguntaQuizCodigoServiceTest {

    private PreguntaQuizCodigoRepository repo;
    private PreguntaQuizCodigoService service;

    @BeforeEach
    void setUp() {
        repo = mock(PreguntaQuizCodigoRepository.class);
        service = new PreguntaQuizCodigoService();
        // Inyección manual si no tienes constructor
        try {
            var field = PreguntaQuizCodigoService.class.getDeclaredField("repo");
            field.setAccessible(true);
            field.set(service, repo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        when(repo.findAll()).thenReturn(Collections.singletonList(pregunta));
        List<PreguntaQuizCodigo> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        pregunta.setId(1L);
        when(repo.findById(1L)).thenReturn(Optional.of(pregunta));
        Optional<PreguntaQuizCodigo> result = service.findById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testSave() {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        when(repo.save(pregunta)).thenReturn(pregunta);
        PreguntaQuizCodigo saved = service.save(pregunta);
        assertEquals(pregunta, saved);
    }

    @Test
    void testDelete() {
        service.delete(5L);
        verify(repo, times(1)).deleteById(5L);
    }

    @Test
    void testFindByModuloId() {
        PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
        when(repo.findByModulo_Id(2L)).thenReturn(Collections.singletonList(pregunta));
        List<PreguntaQuizCodigo> result = service.findByModuloId(2L);
        assertEquals(1, result.size());
    }
}