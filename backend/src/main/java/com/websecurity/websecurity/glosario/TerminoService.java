package com.websecurity.websecurity.glosario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TerminoService {

    @Autowired
    private TerminoRepository terminoRepository;

    public List<Termino> findAll() {
        return terminoRepository.findAll();
    }

    public Optional<Termino> findById(Long id) {
        return terminoRepository.findById(id);
    }

    public Termino save(Termino termino) {
        return terminoRepository.save(termino);
    }

    public void delete(Long id) {
        terminoRepository.deleteById(id);
    }
}