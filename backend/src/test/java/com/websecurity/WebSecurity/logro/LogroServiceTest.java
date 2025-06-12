package com.websecurity.WebService.logro;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroRepository;
import com.websecurity.websecurity.logro.LogroService;
import com.websecurity.websecurity.logro.UsuarioLogro;
import com.websecurity.websecurity.logro.UsuarioLogroRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.MockitoAnnotations;


import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class LogroServiceTest {

    private LogroRepository logroRepository;
    private UsuarioLogroRepository usuarioLogroRepository;
    private UserRepository userRepository;
    private LogroService logroService;

    @BeforeEach
    void setUp() {
        logroRepository = mock(LogroRepository.class);
        usuarioLogroRepository = mock(UsuarioLogroRepository.class);
        userRepository = mock(UserRepository.class);
        logroService = new LogroService();

        // Inyecta los mocks manualmente
        try {
            var fieldLogro = LogroService.class.getDeclaredField("logroRepository");
            fieldLogro.setAccessible(true);
            fieldLogro.set(logroService, logroRepository);

            var fieldUsuarioLogro = LogroService.class.getDeclaredField("usuarioLogroRepository");
            fieldUsuarioLogro.setAccessible(true);
            fieldUsuarioLogro.set(logroService, usuarioLogroRepository);

            var fieldUser = LogroService.class.getDeclaredField("userRepository");
            fieldUser.setAccessible(true);
            fieldUser.set(logroService, userRepository);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testCreate() {
        Logro logro = new Logro();
        when(logroRepository.save(logro)).thenReturn(logro);
        Logro saved = logroService.create(logro);
        assertEquals(logro, saved);
    }

    @Test
    void testUpdate() {
        Logro logro = new Logro();
        logro.setId(1L);
        logro.setNombre("Old");
        logro.setDescripcion("Old desc");
        logro.setIcono("old.png".getBytes());

        Logro data = new Logro();
        data.setNombre("New");
        data.setDescripcion("New desc");
        data.setIcono("new.png".getBytes());

        when(logroRepository.findById(1L)).thenReturn(Optional.of(logro));
        when(logroRepository.save(any(Logro.class))).thenReturn(logro);

        Logro updated = logroService.update(1L, data);
        assertEquals("New", updated.getNombre());
        assertEquals("New desc", updated.getDescripcion());
        assertArrayEquals("new.png".getBytes(), updated.getIcono());
    }

    @Test
    void testDelete() {
        logroService.delete(2L);
        verify(logroRepository, times(1)).deleteById(2L);
    }

    @Test
    void testFindAll() {
        Logro logro = new Logro();
        when(logroRepository.findAll()).thenReturn(Collections.singletonList(logro));
        List<Logro> result = logroService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void testFindById() {
        Logro logro = new Logro();
        logro.setId(3L);
        when(logroRepository.findById(3L)).thenReturn(Optional.of(logro));
        Logro found = logroService.findById(3L);
        assertEquals(3L, found.getId());
    }

    @Test
    void testGetLogrosDesbloqueados() {
        User user = new User();
        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        UsuarioLogro ul = new UsuarioLogro();
        when(usuarioLogroRepository.findByUsuario(user)).thenReturn(Collections.singletonList(ul));
        List<UsuarioLogro> result = logroService.getLogrosDesbloqueados("raul");
        assertEquals(1, result.size());
    }

    @Test
    void testGetLogrosPendientes() {
        User user = new User();
        Logro l1 = new Logro();
        l1.setId(1L);
        Logro l2 = new Logro();
        l2.setId(2L);
        UsuarioLogro ul = new UsuarioLogro();
        ul.setLogro(l1);

        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(usuarioLogroRepository.findByUsuario(user)).thenReturn(Collections.singletonList(ul));
        when(logroRepository.findAll()).thenReturn(new java.util.ArrayList<>(List.of(l1, l2)));

        List<Logro> pendientes = logroService.getLogrosPendientes("raul");
        assertEquals(1, pendientes.size());
        assertEquals(2L, pendientes.get(0).getId());
    }

    @Test
    void testDesbloquearLogro_Nuevo() {
        User user = new User();
        Logro logro = new Logro();
        logro.setNombre("TestLogro");

        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(logroRepository.findByNombre("TestLogro")).thenReturn(logro);
        when(usuarioLogroRepository.existsByUsuarioAndLogro(user, logro)).thenReturn(false);

        Logro result = logroService.desbloquearLogro("raul", "TestLogro");
        assertEquals(logro, result);
        verify(usuarioLogroRepository, times(1)).save(any(UsuarioLogro.class));
    }

    @Test
    void testDesbloquearLogro_YaDesbloqueado() {
        User user = new User();
        Logro logro = new Logro();
        logro.setNombre("TestLogro");

        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(logroRepository.findByNombre("TestLogro")).thenReturn(logro);
        when(usuarioLogroRepository.existsByUsuarioAndLogro(user, logro)).thenReturn(true);

        Logro result = logroService.desbloquearLogro("raul", "TestLogro");
        assertNull(result);
        verify(usuarioLogroRepository, never()).save(any(UsuarioLogro.class));
    }

    @Test
    void testDesbloquearLogro_LogroNoExiste() {
        User user = new User();

        when(userRepository.findByUsername("raul")).thenReturn(Optional.of(user));
        when(logroRepository.findByNombre("Inexistente")).thenReturn(null);

        Logro result = logroService.desbloquearLogro("raul", "Inexistente");
        assertNull(result);
    }
}