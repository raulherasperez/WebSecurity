package com.websecurity.WebSecurity.reporte;

import com.websecurity.websecurity.reporte.ReporteError;
import com.websecurity.websecurity.reporte.ReporteErrorRepository;
import com.websecurity.websecurity.reporte.ReporteErrorService;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import org.mockito.InjectMocks;


import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReporteErrorServiceTest {

    private ReporteErrorRepository reporteErrorRepository;
    private UserRepository userRepository;
    private ReporteErrorService service;

    @BeforeEach
    void setUp() {
        reporteErrorRepository = mock(ReporteErrorRepository.class);
        userRepository = mock(UserRepository.class);
        service = new ReporteErrorService();

        // Inyecta los mocks manualmente
        try {
            var fieldRepo = ReporteErrorService.class.getDeclaredField("reporteErrorRepository");
            fieldRepo.setAccessible(true);
            fieldRepo.set(service, reporteErrorRepository);

            var fieldUser = ReporteErrorService.class.getDeclaredField("userRepository");
            fieldUser.setAccessible(true);
            fieldUser.set(service, userRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        ReporteError r = new ReporteError();
        when(reporteErrorRepository.findAll()).thenReturn(Collections.singletonList(r));
        List<ReporteError> result = service.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindByUsuario() {
        ReporteError r = new ReporteError();
        when(reporteErrorRepository.findByUsuarioUsername("raul")).thenReturn(Collections.singletonList(r));
        List<ReporteError> result = service.findByUsuario("raul");
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        ReporteError r = new ReporteError();
        r.setId(1L);
        when(reporteErrorRepository.findById(1L)).thenReturn(Optional.of(r));
        Optional<ReporteError> found = service.findById(1L);
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }

    @Test
    void testSave() {
        User user = new User();
        user.setUsername("raul");
        ReporteError r = new ReporteError();
        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(reporteErrorRepository.save(any(ReporteError.class))).thenAnswer(inv -> inv.getArgument(0));

        ReporteError saved = service.save(r, "raul");
        assertEquals(user, saved.getUsuario());
        assertNotNull(saved.getFechaPublicacion());
    }
}