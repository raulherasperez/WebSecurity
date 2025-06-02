package com.websecurity.websecurity.ejemplo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EjemploService {
    @Autowired
    private EjemploRepository ejemploRepository;

    public List<Ejemplo> findAll() { return ejemploRepository.findAll(); }
    public Optional<Ejemplo> findById(Long id) { return ejemploRepository.findById(id); }
    public Ejemplo save(Ejemplo ejemplo) { return ejemploRepository.save(ejemplo); }
    public void delete(Long id) { ejemploRepository.deleteById(id); }
    public List<Ejemplo> findByModuloId(Long moduloId) {
        return ejemploRepository.findByModulo_Id(moduloId);
    }
}