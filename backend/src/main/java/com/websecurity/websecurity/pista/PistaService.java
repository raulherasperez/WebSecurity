package com.websecurity.websecurity.pista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PistaService {
    @Autowired
    private PistaRepository repo;

    public List<Pista> findAll() { return repo.findAll(); }
    public Optional<Pista> findById(Long id) { return repo.findById(id); }
    public Pista save(Pista p) { return repo.save(p); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Pista> findByModuloId(Long moduloId) {
        return repo.findByModulo_Id(moduloId);
    }
}