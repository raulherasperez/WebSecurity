package com.websecurity.websecurity.preguntateorica;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PreguntaTeoricaService {
    @Autowired
    private PreguntaTeoricaRepository repo;

    public List<PreguntaTeorica> findAll() { return repo.findAll(); }
    public Optional<PreguntaTeorica> findById(Long id) { return repo.findById(id); }
    public PreguntaTeorica save(PreguntaTeorica p) { return repo.save(p); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<PreguntaTeorica> findByModuloId(Long moduloId) {
        return repo.findByModulo_Id(moduloId);
    }
}