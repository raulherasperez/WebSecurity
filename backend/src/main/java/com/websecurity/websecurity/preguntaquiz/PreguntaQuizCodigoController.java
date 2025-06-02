package com.websecurity.websecurity.preguntaquiz;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/preguntas-quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class PreguntaQuizCodigoController {
    private final PreguntaQuizCodigoService service;

    public PreguntaQuizCodigoController(PreguntaQuizCodigoService service) {
        this.service = service;
    }

    @GetMapping("/modulo/{moduloId}")
    public List<PreguntaQuizCodigo> getByModulo(@PathVariable Long moduloId) {
    return service.findByModuloId(moduloId);
    }

    @GetMapping
    public List<PreguntaQuizCodigo> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public PreguntaQuizCodigo getById(@PathVariable Long id) { return service.findById(id).orElseThrow(); }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public PreguntaQuizCodigo create(@RequestBody PreguntaQuizCodigo p) { return service.save(p); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public PreguntaQuizCodigo update(@PathVariable Long id, @RequestBody PreguntaQuizCodigo p) {
        p.setId(id);
        return service.save(p);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}