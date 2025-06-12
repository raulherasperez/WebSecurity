package com.websecurity.WebSecurity.comentario;

import com.websecurity.websecurity.comentario.Comentario;
import com.websecurity.websecurity.comentario.ComentarioRepository;
import com.websecurity.websecurity.comentario.ComentarioService;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.ModuloRepository;
import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.util.Optional;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.springframework.test.util.ReflectionTestUtils;

public class ComentarioServiceTest {

    private ComentarioRepository comentarioRepository = mock(ComentarioRepository.class);
    private UserRepository userRepository = mock(UserRepository.class);
    private ModuloRepository moduloRepository = mock(ModuloRepository.class);

    private ComentarioService comentarioService;

    @BeforeEach
    void setUp() {
        comentarioService = new ComentarioService();
        ReflectionTestUtils.setField(comentarioService, "comentarioRepository", comentarioRepository);
        ReflectionTestUtils.setField(comentarioService, "userRepository", userRepository);
        ReflectionTestUtils.setField(comentarioService, "moduloRepository", moduloRepository);
    }

    @Test
    void testGetComentariosPorModulo() {
        Modulo modulo = new Modulo();
        modulo.setId(1L);
        Comentario comentario = new Comentario();
        comentario.setModulo(modulo);

        when(moduloRepository.findById(1L)).thenReturn(Optional.of(modulo));
        when(comentarioRepository.findByModuloOrderByFechaPublicacionAsc(modulo))
                .thenReturn(Collections.singletonList(comentario));

        List<Comentario> result = comentarioService.getComentariosPorModulo(1L);
        assertEquals(1, result.size());
        assertEquals(modulo, result.get(0).getModulo());
    }

    @Test
    void testCrearComentario() {
        Modulo modulo = new Modulo();
        modulo.setId(2L);
        User user = new User();
        user.setUsername("testuser");
        Comentario comentario = new Comentario();
        comentario.setTexto("Hola mundo");
        comentario.setUsuario(user);      // <-- Añade esto
        comentario.setModulo(modulo);     // <-- Y esto

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(moduloRepository.findById(2L)).thenReturn(Optional.of(modulo));
        when(comentarioRepository.save(any(Comentario.class))).thenReturn(comentario);

        Comentario creado = comentarioService.crearComentario(2L, "Hola mundo", "testuser");
        assertEquals("Hola mundo", creado.getTexto());
        assertEquals(user.getUsername(), creado.getUsuario().getUsername());
        assertEquals(modulo, creado.getModulo());
}
    @Test
    void testEliminarComentario() {
        comentarioService.eliminarComentario(5L);
        verify(comentarioRepository, times(1)).deleteById(5L);
    }
}