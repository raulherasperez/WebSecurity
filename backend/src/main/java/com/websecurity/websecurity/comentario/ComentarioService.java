package com.websecurity.websecurity.comentario;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.modulo.Modulo;
import com.websecurity.websecurity.modulo.ModuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComentarioService {
    @Autowired
    private ComentarioRepository comentarioRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModuloRepository moduloRepository;

    public List<Comentario> getComentariosPorModulo(Long moduloId) {
        Modulo modulo = moduloRepository.findById(moduloId).orElseThrow();
        return comentarioRepository.findByModuloOrderByFechaPublicacionAsc(modulo);
    }

    public Comentario crearComentario(Long moduloId, String texto, String username) {
        User usuario = userRepository.findByUsername(username).orElseThrow();
        Modulo modulo = moduloRepository.findById(moduloId).orElseThrow();
        Comentario comentario = new Comentario();
        comentario.setModulo(modulo);
        comentario.setTexto(texto);
        comentario.setUsuario(usuario);
        return comentarioRepository.save(comentario);
    }

    public void eliminarComentario(Long id) {
        comentarioRepository.deleteById(id);
    }
}