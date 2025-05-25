package com.websecurity.websecurity.comentario;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComentarioService {
    @Autowired
    private ComentarioRepository comentarioRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Comentario> getComentariosPorModulo(String modulo) {
        return comentarioRepository.findByModuloOrderByFechaPublicacionAsc(modulo);
    }

    public Comentario crearComentario(String modulo, String texto, String username) {
        User usuario = userRepository.findByUsername(username).orElseThrow();
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