package com.websecurity.websecurity.preguntateorica;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/preguntas-teoricas")
@CrossOrigin(origins = "http://localhost:3000")
public class PreguntaTeoricaController {
    private final PreguntaTeoricaService service;

    public PreguntaTeoricaController(PreguntaTeoricaService service) {
        this.service = service;
    }

    @GetMapping
    public List<PreguntaTeorica> getAll() { return service.findAll(); }

    @GetMapping("/modulo/{moduloId}")
    public List<PreguntaTeorica> getByModulo(@PathVariable Long moduloId) {
        return service.findByModuloId(moduloId);
    }

    @GetMapping("/{id}")
    public PreguntaTeorica getById(@PathVariable Long id) { return service.findById(id).orElseThrow(); }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public PreguntaTeorica create(@RequestBody PreguntaTeorica p) { return service.save(p); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public PreguntaTeorica update(@PathVariable Long id, @RequestBody PreguntaTeorica p) {
        p.setId(id);
        return service.save(p);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}