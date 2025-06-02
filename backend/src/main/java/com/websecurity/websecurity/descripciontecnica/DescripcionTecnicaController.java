package com.websecurity.websecurity.descripciontecnica;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/descripciones-tecnicas")
@CrossOrigin(origins = "http://localhost:3000")
public class DescripcionTecnicaController {
    private final DescripcionTecnicaService service;

    public DescripcionTecnicaController(DescripcionTecnicaService service) {
        this.service = service;
    }

    @GetMapping
    public List<DescripcionTecnica> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public DescripcionTecnica getById(@PathVariable Long id) {
        return service.findById(id).orElseThrow();
    }

    @GetMapping("/modulo/{moduloId}")
    public List<DescripcionTecnica> getByModulo(@PathVariable Long moduloId) {
        return service.findByModuloId(moduloId);
    }

    @GetMapping("/modulo/{moduloId}/nivel/{nivel}")
    public List<DescripcionTecnica> getByModuloAndNivel(@PathVariable Long moduloId, @PathVariable com.websecurity.websecurity.modulo.Nivel nivel) {
        return service.findByModuloIdAndNivel(moduloId, nivel);
    }

    @PostMapping
    public DescripcionTecnica create(@RequestBody DescripcionTecnica d) {
        return service.save(d);
    }

    @PutMapping("/{id}")
    public DescripcionTecnica update(@PathVariable Long id, @RequestBody DescripcionTecnica d) {
        d.setId(id);
        return service.save(d);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}