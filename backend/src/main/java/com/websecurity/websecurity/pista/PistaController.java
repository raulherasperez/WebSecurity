package com.websecurity.websecurity.pista;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/pistas")
@CrossOrigin(origins = "http://localhost:3000")
public class PistaController {
    private final PistaService service;

    public PistaController(PistaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pista> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Pista getById(@PathVariable Long id) { return service.findById(id).orElseThrow(); }

    @GetMapping("/modulo/{moduloId}")
    public List<Pista> getByModulo(@PathVariable Long moduloId) {
        return service.findByModuloId(moduloId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Pista create(@RequestBody Pista p) { return service.save(p); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Pista update(@PathVariable Long id, @RequestBody Pista p) {
        p.setId(id);
        return service.save(p);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}