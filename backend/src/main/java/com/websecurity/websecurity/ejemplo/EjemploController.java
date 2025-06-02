package com.websecurity.websecurity.ejemplo;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/ejemplos")
@CrossOrigin(origins = "http://localhost:3000")
public class EjemploController {
    private final EjemploService ejemploService;

    public EjemploController(EjemploService ejemploService) {
        this.ejemploService = ejemploService;
    }

    @GetMapping
    public List<Ejemplo> getAll() { return ejemploService.findAll(); }

    @GetMapping("/{id}")
    public Ejemplo getById(@PathVariable Long id) { return ejemploService.findById(id).orElseThrow(); }

    @GetMapping("/modulo/{moduloId}")
    public List<Ejemplo> getByModulo(@PathVariable Long moduloId) {
        return ejemploService.findByModuloId(moduloId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Ejemplo create(@RequestBody Ejemplo ejemplo) { return ejemploService.save(ejemplo); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Ejemplo update(@PathVariable Long id, @RequestBody Ejemplo ejemplo) {
        ejemplo.setId(id);
        return ejemploService.save(ejemplo);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { ejemploService.delete(id); }
}