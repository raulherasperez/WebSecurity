package com.websecurity.websecurity;

import com.websecurity.websecurity.user.User;
import com.websecurity.websecurity.user.UserRepository;
import com.websecurity.websecurity.guia.Guia;
import com.websecurity.websecurity.guia.GuiaRepository;
import com.websecurity.websecurity.vm.VirtualMachine;
import com.websecurity.websecurity.vm.VirtualMachineRepository;
import com.websecurity.websecurity.sugerencia.Sugerencia;
import com.websecurity.websecurity.sugerencia.SugerenciaRepository;
import com.websecurity.websecurity.reporte.ReporteError;
import com.websecurity.websecurity.reporte.ReporteErrorRepository;
import com.websecurity.websecurity.logro.Logro;
import com.websecurity.websecurity.logro.LogroRepository;
import com.websecurity.websecurity.logro.UsuarioLogro;
import com.websecurity.websecurity.logro.UsuarioLogroRepository;
import com.websecurity.websecurity.glosario.Termino;
import com.websecurity.websecurity.glosario.TerminoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.InputStream;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GuiaRepository guiaRepository;

    @Autowired
    private VirtualMachineRepository vmRepository;

    @Autowired
    private SugerenciaRepository sugerenciaRepository;

    @Autowired
    private ReporteErrorRepository reporteErrorRepository;

    @Autowired
    private LogroRepository logroRepository;

    @Autowired
    private UsuarioLogroRepository usuarioLogroRepository;

    @Autowired
    private TerminoRepository terminoRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        // Usuarios normales con foto
        createUserIfNotExists("user1", "user1@websec.com", "user1pass", User.Rol.USER, loadFoto("user1.jpg"));
        createUserIfNotExists("user2", "user2@websec.com", "user2pass", User.Rol.USER, loadFoto("user2.jpg"));
        createUserIfNotExists("user3", "user3@websec.com", "user3pass", User.Rol.USER, loadFoto("user3.jpg"));
        createUserIfNotExists("user4", "user4@websec.com", "user4pass", User.Rol.USER, loadFoto("user3.jpg"));
        createUserIfNotExists("user5", "user5@websec.com", "user5pass", User.Rol.USER, loadFoto("user3.jpg"));
        // Admin con foto
        createUserIfNotExists("admin", "admin@websec.com", "adminpass", User.Rol.ROLE_ADMIN, loadFoto("admin.jpg"));

        // Moderador con foto
        createUserIfNotExists("moderator", "moderator@websec.com", "modpass", User.Rol.MODERATOR, loadFoto("moderator.jpg"));

        // Guías de prueba para cada usuario con rol USER
        createGuiaIfNotExists("user1", "Guía de prueba 1", "Contenido de la guía de prueba 1.");
        createGuiaIfNotExists("user2", "Guía de prueba 2", "Contenido de la guía de prueba 2.");
        createGuiaIfNotExists("user3", "Guía de prueba 3", "Contenido de la guía de prueba 3.");

        // Máquinas virtuales de prueba para cada usuario con rol USER
        createVMIfNotExists("user1", "Máquina Kali Linux", "Máquina con Kali Linux para pentesting.", "https://cdimage.kali.org/kali-2024.1/kali-linux-2024.1-vmware-amd64.7z");
        createVMIfNotExists("user2", "Máquina Metasploitable", "Máquina vulnerable para practicar exploits.", "https://sourceforge.net/projects/metasploitable/files/Metasploitable2/metasploitable-linux-2.0.0.zip");
        createVMIfNotExists("user3", "Máquina Windows 10 Eval", "Máquina Windows 10 de evaluación para pruebas.", "https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/");

        // Sugerencias de prueba para cada usuario con rol USER
        createSugerenciaIfNotExists("user1", "Sugerencia de user1", "Texto de sugerencia de user1.");
        createSugerenciaIfNotExists("user2", "Sugerencia de user2", "Texto de sugerencia de user2.");
        createSugerenciaIfNotExists("user3", "Sugerencia de user3", "Texto de sugerencia de user3.");

        // Reportes de error de prueba para cada usuario con rol USER
        createReporteIfNotExists("user1", "Error de user1", "Descripción del error reportado por user1.");
        createReporteIfNotExists("user2", "Error de user2", "Descripción del error reportado por user2.");
        createReporteIfNotExists("user3", "Error de user3", "Descripción del error reportado por user3.");

        // Logros de prueba y desbloqueo para cada usuario
        createLogroIfNotExists("Primer Logro", "Has desbloqueado tu primer logro.");
        desbloquearLogroIfNotExists("user1", "Primer Logro");
        desbloquearLogroIfNotExists("user2", "Primer Logro");
        desbloquearLogroIfNotExists("user3", "Primer Logro");

        createLogroIfNotExists("Primer Logro", "Has desbloqueado tu primer logro.");
        createLogroIfNotExists("Reportero", "Has enviado tu primer reporte de error.");
        createLogroIfNotExists("Colaborador", "Has enviado una sugerencia por primera vez.");
        createLogroIfNotExists("¿Cómo estan los máquinas?", "Has publicado tu primera máquina virtual.");
        createLogroIfNotExists("Alma de guía", "Has publicado tu primera guía.");
        createLogroIfNotExists("Aprendiz SQL", "Has realizado una inyección SQL.");
        createLogroIfNotExists("XSS Hunter", "Has conseguido hacer un ataque XSS exitoso.");
        createLogroIfNotExists("Maestro del CSRF", "Has realizado un ataque de CSRF.");
        createLogroIfNotExists("Rompedor de accesos", "Has completado el ataque de Broken Access Control.");
        createLogroIfNotExists("Misión código SSRF", "Has completado el ataque de SSRF.");
        createLogroIfNotExists("Suplantación de identidad", "Has explotado una vulnerabilidad Broken Authentication.");
        createLogroIfNotExists("Estudiante aprendiz", "Has completado tu primer test teórico");
        createLogroIfNotExists("Identificador novato", "Has completado tu primer test de código vulnerable");

        // Términos de prueba para el glosario
        createTerminoIfNotExists(
            "Phishing",
            "Técnica de ingeniería social que busca obtener información confidencial haciéndose pasar por una entidad confiable.",
            "https://es.wikipedia.org/wiki/Phishing"
        );
        createTerminoIfNotExists(
            "XSS",
            "Cross-Site Scripting: vulnerabilidad que permite la inyección de scripts en sitios web visitados por otros usuarios.",
            "https://owasp.org/www-community/attacks/xss/"
        );
        createTerminoIfNotExists(
            "SQL Injection",
            "Técnica de inyección de código que explota vulnerabilidades en la capa de base de datos de una aplicación.",
            "https://owasp.org/www-community/attacks/SQL_Injection"
        );
    }

    private void createUserIfNotExists(String username, String email, String rawPassword, User.Rol rol, byte[] foto) {
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFoto(foto); // Siempre actualiza la foto
            userRepository.save(user);
        } else if (userRepository.findByUsername(username).isEmpty()) {
                    User user = new User();
                    user.setUsername(username);
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode(rawPassword));
                    user.setRol(rol);
                    user.setFoto(foto); // Asigna la foto
                    userRepository.save(user);
                }
            }

    private byte[] loadFoto(String filename) {
    try (InputStream is = getClass().getClassLoader().getResourceAsStream("fotos/" + filename)) {
        if (is == null) {
            System.err.println("No se pudo encontrar la foto: " + filename);
            return null;
        }
        byte[] data = is.readAllBytes();
        System.out.println("Foto cargada: " + filename + " (" + data.length + " bytes)");
        return data;
    } catch (Exception e) {
        System.err.println("No se pudo cargar la foto: " + filename + " (" + e.getMessage() + ")");
        return null;
    }
}


    private void createGuiaIfNotExists(String username, String titulo, String contenido) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && guiaRepository.findByTituloAndUsuario(titulo, user).isEmpty()) {
            Guia guia = new Guia();
            guia.setTitulo(titulo);
            guia.setContenido(contenido);
            guia.setFechaAñadida(new Date());
            guia.setUsuario(user);
            guiaRepository.save(guia);
        }
    }

    private void createVMIfNotExists(String username, String nombre, String descripcion, String enlaceDescarga) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && vmRepository.findByUsuarioUsername(username).stream().noneMatch(vm -> vm.getNombre().equals(nombre))) {
            VirtualMachine vm = new VirtualMachine();
            vm.setNombre(nombre);
            vm.setDescripcion(descripcion);
            vm.setEnlaceDescarga(enlaceDescarga);
            vm.setFechaAñadida(new Date());
            vm.setUsuario(user);
            vmRepository.save(vm);
        }
    }

    private void createSugerenciaIfNotExists(String username, String titulo, String texto) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && sugerenciaRepository.findByUsuarioUsername(username).stream().noneMatch(s -> s.getTitulo().equals(titulo))) {
            Sugerencia sugerencia = new Sugerencia();
            sugerencia.setTitulo(titulo);
            sugerencia.setTexto(texto);
            sugerencia.setFechaPublicacion(new Date());
            sugerencia.setUsuario(user);
            sugerenciaRepository.save(sugerencia);
        }
    }

    private void createReporteIfNotExists(String username, String titulo, String texto) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && reporteErrorRepository.findByUsuarioUsername(username).stream().noneMatch(r -> r.getTitulo().equals(titulo))) {
            ReporteError reporte = new ReporteError();
            reporte.setTitulo(titulo);
            reporte.setTexto(texto);
            reporte.setFechaPublicacion(new Date());
            reporte.setUsuario(user);
            reporteErrorRepository.save(reporte);
        }
    }

    private void createLogroIfNotExists(String nombre, String descripcion) {
    if (logroRepository.findByNombre(nombre) == null) {
        Logro logro = new Logro();
        logro.setNombre(nombre);
        logro.setDescripcion(descripcion);
        logro.setIcono(loadFoto("logro.png"));
        logroRepository.save(logro);
    }
}

    private void desbloquearLogroIfNotExists(String username, String nombreLogro) {
        User user = userRepository.findByUsername(username).orElse(null);
        Logro logro = logroRepository.findByNombre(nombreLogro);
        if (user != null && logro != null && !usuarioLogroRepository.existsByUsuarioAndLogro(user, logro)) {
            UsuarioLogro ul = new UsuarioLogro();
            ul.setUsuario(user);
            ul.setLogro(logro);
            ul.setFechaDesbloqueo(new Date());
            usuarioLogroRepository.save(ul);
        }
    }

    private void createTerminoIfNotExists(String termino, String significado, String enlaceReferencia) {
        if (terminoRepository == null) return;
        if (!terminoRepository.existsByTermino(termino)) {
            Termino t = new Termino();
            t.setTermino(termino);
            t.setSignificado(significado);
            t.setEnlaceReferencia(enlaceReferencia);
            terminoRepository.save(t);
        }
    }
}