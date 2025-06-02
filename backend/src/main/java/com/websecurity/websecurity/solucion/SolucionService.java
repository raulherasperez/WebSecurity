package com.websecurity.websecurity.solucion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SolucionService {
    @Autowired
    private SolucionRepository repo;

    public List<Solucion> findAll() { return repo.findAll(); }
    public Optional<Solucion> findById(Long id) { return repo.findById(id); }
    public Solucion save(Solucion s) { return repo.save(s); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Solucion> findByModuloId(Long moduloId) {
        return repo.findByModulo_Id(moduloId);
    }
}