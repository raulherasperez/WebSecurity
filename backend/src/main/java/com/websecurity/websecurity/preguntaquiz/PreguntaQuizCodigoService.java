package com.websecurity.websecurity.preguntaquiz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PreguntaQuizCodigoService {
    @Autowired
    private PreguntaQuizCodigoRepository repo;

    public List<PreguntaQuizCodigo> findAll() { return repo.findAll(); }
    public Optional<PreguntaQuizCodigo> findById(Long id) { return repo.findById(id); }
    public PreguntaQuizCodigo save(PreguntaQuizCodigo p) { return repo.save(p); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<PreguntaQuizCodigo> findByModuloId(Long moduloId) {
    return repo.findByModulo_Id(moduloId);
}
}