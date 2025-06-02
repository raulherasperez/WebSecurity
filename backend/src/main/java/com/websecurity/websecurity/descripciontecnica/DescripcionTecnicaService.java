package com.websecurity.websecurity.descripciontecnica;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DescripcionTecnicaService {
    private final DescripcionTecnicaRepository repo;

    public DescripcionTecnicaService(DescripcionTecnicaRepository repo) {
        this.repo = repo;
    }

    public List<DescripcionTecnica> findAll() {
        return repo.findAll();
    }

    public Optional<DescripcionTecnica> findById(Long id) {
        return repo.findById(id);
    }

    public List<DescripcionTecnica> findByModuloId(Long moduloId) {
        return repo.findByModuloId(moduloId);
    }

    public List<DescripcionTecnica> findByModuloIdAndNivel(Long moduloId, com.websecurity.websecurity.modulo.Nivel nivel) {
        return repo.findByModuloIdAndNivel(moduloId, nivel);
    }

    public DescripcionTecnica save(DescripcionTecnica d) {
        return repo.save(d);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}