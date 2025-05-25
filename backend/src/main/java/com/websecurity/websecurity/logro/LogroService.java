package com.websecurity.websecurity.logro;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogroService {

    @Autowired
    private LogroRepository logroRepository;

    @Autowired
    private UsuarioLogroRepository usuarioLogroRepository;

    @Autowired
    private UserRepository userRepository;

    // ADMIN: CRUD de logros
    public Logro create(Logro logro) { return logroRepository.save(logro); }
    public Logro update(Long id, Logro data) {
        Logro l = logroRepository.findById(id).orElseThrow();
        l.setNombre(data.getNombre());
        l.setDescripcion(data.getDescripcion());
        l.setIcono(data.getIcono());
        return logroRepository.save(l);
    }
    public void delete(Long id) { logroRepository.deleteById(id); }
    public List<Logro> findAll() { return logroRepository.findAll(); }
    public Logro findById(Long id) { return logroRepository.findById(id).orElse(null); }

    // USUARIO: ver logros desbloqueados y pendientes
    public List<UsuarioLogro> getLogrosDesbloqueados(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return usuarioLogroRepository.findByUsuario(user);
    }
    public List<Logro> getLogrosPendientes(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        List<UsuarioLogro> desbloqueados = usuarioLogroRepository.findByUsuario(user);
        List<Logro> todos = logroRepository.findAll();
        todos.removeIf(l -> desbloqueados.stream().anyMatch(ul -> ul.getLogro().getId().equals(l.getId())));
        return todos;
    }

    // ----------- MECANISMO DE DESBLOQUEO DE LOGROS -----------
    public boolean desbloquearLogro(String username, String nombreLogro) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Logro logro = logroRepository.findByNombre(nombreLogro);
        if (logro == null) return false;
        if (!usuarioLogroRepository.existsByUsuarioAndLogro(user, logro)) {
            UsuarioLogro ul = new UsuarioLogro();
            ul.setUsuario(user);
            ul.setLogro(logro);
            usuarioLogroRepository.save(ul);
            return true;
        }
        return false; // Ya desbloqueado
    }
}