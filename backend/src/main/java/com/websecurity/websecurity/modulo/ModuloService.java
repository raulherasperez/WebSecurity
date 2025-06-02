package com.websecurity.websecurity.modulo;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ModuloService {
    private final ModuloRepository moduloRepository;

    public ModuloService(ModuloRepository moduloRepository) {
        this.moduloRepository = moduloRepository;
    }

    public List<Modulo> findAll() {
        return moduloRepository.findAll();
    }

    public Optional<Modulo> findById(Long id) {
        return moduloRepository.findById(id);
    }

    public Modulo save(Modulo modulo) {
        return moduloRepository.save(modulo);
    }

    public void deleteById(Long id) {
        moduloRepository.deleteById(id);
    }
}