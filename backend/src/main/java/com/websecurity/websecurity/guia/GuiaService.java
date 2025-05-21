package com.websecurity.websecurity.guia;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuiaService {

    @Autowired
    private GuiaRepository guiaRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Guia> findAll() {
        return guiaRepository.findAll();
    }

    public Optional<Guia> findById(Long id) {
        return guiaRepository.findById(id);
    }

    public Guia save(Guia guia, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        guia.setUsuario(user);
        guia.setFechaAñadida(new java.util.Date());
        return guiaRepository.save(guia);
    }

    public Guia update(Long id, Guia guiaData, String username) {
        Guia guia = guiaRepository.findById(id).orElseThrow();
        if (!guia.getUsuario().getUsername().equals(username)) {
            throw new SecurityException("No autorizado");
        }
        guia.setTitulo(guiaData.getTitulo());
        guia.setContenido(guiaData.getContenido());
        return guiaRepository.save(guia);
    }

    public void delete(Long id, String username) {
        Guia guia = guiaRepository.findById(id).orElseThrow();
        if (!guia.getUsuario().getUsername().equals(username)) {
            throw new SecurityException("No autorizado");
        }
        guiaRepository.delete(guia);
    }
}
