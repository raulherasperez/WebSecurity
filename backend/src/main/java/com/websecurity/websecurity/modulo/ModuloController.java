package com.websecurity.websecurity.modulo;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/modulos")
public class ModuloController {
    private final ModuloService moduloService;

    public ModuloController(ModuloService moduloService) {
        this.moduloService = moduloService;
    }

    @GetMapping
    public List<Modulo> getAll() {
        return moduloService.findAll();
    }

    @GetMapping("/{id}")
    public Modulo getById(@PathVariable Long id) {
        return moduloService.findById(id).orElseThrow();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Modulo create(@RequestBody Modulo modulo) {
        return moduloService.save(modulo);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Modulo update(@PathVariable Long id, @RequestBody Modulo modulo) {
        modulo.setId(id);
        return moduloService.save(modulo);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        moduloService.deleteById(id);
    }
}