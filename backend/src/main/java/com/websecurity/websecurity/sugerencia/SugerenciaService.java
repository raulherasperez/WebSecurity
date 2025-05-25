// filepath: backend/src/main/java/com/websecurity/websecurity/sugerencia/SugerenciaService.java
package com.websecurity.websecurity.sugerencia;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SugerenciaService {

    @Autowired
    private SugerenciaRepository sugerenciaRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Sugerencia> findAll() {
        return sugerenciaRepository.findAll();
    }

    public List<Sugerencia> findByUsuario(String username) {
        return sugerenciaRepository.findByUsuarioUsername(username);
    }

    public Optional<Sugerencia> findById(Long id) {
        return sugerenciaRepository.findById(id);
    }

    public Sugerencia save(Sugerencia sugerencia, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        sugerencia.setUsuario(user);
        sugerencia.setFechaPublicacion(new java.util.Date());
        return sugerenciaRepository.save(sugerencia);
    }
}