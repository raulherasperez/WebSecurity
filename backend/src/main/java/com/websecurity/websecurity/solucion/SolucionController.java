package com.websecurity.websecurity.solucion;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/soluciones")
@CrossOrigin(origins = "http://localhost:3000")
public class SolucionController {
    private final SolucionService service;

    public SolucionController(SolucionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Solucion> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Solucion getById(@PathVariable Long id) { return service.findById(id).orElseThrow(); }

    @GetMapping("/modulo/{moduloId}")
    public List<Solucion> getByModulo(@PathVariable Long moduloId) {
        return service.findByModuloId(moduloId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Solucion create(@RequestBody Solucion s) { return service.save(s); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Solucion update(@PathVariable Long id, @RequestBody Solucion s) {
        s.setId(id);
        return service.save(s);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}