package com.websecurity.websecurity;

import com.websecurity.websecurity.modulo.*;
import com.websecurity.websecurity.ejemplo.*;
import com.websecurity.websecurity.preguntateorica.*;
import com.websecurity.websecurity.preguntaquiz.*;
import com.websecurity.websecurity.pista.*;
import com.websecurity.websecurity.solucion.*;
import com.websecurity.websecurity.descripciontecnica.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Map;
import java.util.Optional;

@Component
public class ModuleDataInitializer implements CommandLineRunner {

    @Autowired private ModuloRepository moduloRepository;
    @Autowired private EjemploRepository ejemploRepository;
    @Autowired private PreguntaTeoricaRepository preguntaTeoricaRepository;
    @Autowired private PreguntaQuizCodigoRepository preguntaQuizCodigoRepository;
    @Autowired private PistaRepository pistaRepository;
    @Autowired private SolucionRepository solucionRepository;
    @Autowired private DescripcionTecnicaRepository descripcionTecnicaRepository;

    @Override
    public void run(String... args) throws Exception {

        ObjectMapper mapper = new ObjectMapper();

        // --- MÓDULO: Inyección SQL (SQLi) ---
        Optional<Modulo> sqliOpt = moduloRepository.findByNombre("Inyección SQL");
        Modulo sqli;
        if (sqliOpt.isPresent()) {
            sqli = sqliOpt.get();
        } else {
            Map<String, Object> sqliData = mapper.readValue(
                Files.readString(Paths.get("src/main/resources/informacion/sqli/sqli_data.json"), StandardCharsets.UTF_8),
                Map.class
            );

            String descripcionSQLi = (String) sqliData.get("descripcion");
            String ejerciciosSQLi = (String) sqliData.get("descripcionEjercicios");
            String ejemploSQli = (String) sqliData.get("ejemplo");

            sqli = new Modulo();
            sqli.setDescripcion(descripcionSQLi);
            sqli.setDescripcionEjercicios(ejerciciosSQLi);
            sqli.setNombre("Inyección SQL");
            sqli.setVideoUrl("https://www.youtube.com/embed/ciNHn38EyRc");
            sqli.setInfoEntorno("Pulsa el botón para abrir la tienda vulnerable y practicar ataques de inyección SQL.");
            moduloRepository.save(sqli);

            Map<String, Map<String, String>> pistas = (Map<String, Map<String, String>>) sqliData.get("pistas");
            Map<String, Map<String, String>> soluciones = (Map<String, Map<String, String>>) sqliData.get("soluciones");
            Map<String, String> explicaciones = (Map<String, String>) sqliData.get("explicaciones");

            // Ejemplo
            Ejemplo sqliEjemplo = newEjemplo(sqli, "Login vulnerable a SQLi", ejemploSQli,
                "username = request.form['username']\n" +
                "password = request.form['password']\n" +
                "query = f\"SELECT * FROM usuarios WHERE nombre = '{username}' AND password = '{password}'\"\n" +
                "cursor.execute(query)"
            );
            if (sqliEjemplo != null) ejemploRepository.save(sqliEjemplo);

            // Pistas por nivel
            for (String ejercicio : pistas.keySet()) {
                Map<String, String> niveles = pistas.get(ejercicio);
                for (String nivel : niveles.keySet()) {
                    Pista pista = newPista(sqli, Nivel.valueOf(nivel.toUpperCase()), niveles.get(nivel));
                    if (pista != null) pistaRepository.save(pista);
                }
            }

            // Soluciones por nivel
            for (String ejercicio : soluciones.keySet()) {
                Map<String, String> niveles = soluciones.get(ejercicio);
                for (String nivel : niveles.keySet()) {
                    Solucion solucion = newSolucion(sqli, Nivel.valueOf(nivel.toUpperCase()), niveles.get(nivel));
                    if (solucion != null) solucionRepository.save(solucion);
                }
            }

            // Descripciones técnicas por nivel
            for (String nivel : explicaciones.keySet()) {
                DescripcionTecnica desc = newDescripcionTecnica(sqli, Nivel.valueOf(nivel.toUpperCase()), explicaciones.get(nivel), "");
                if (desc != null) descripcionTecnicaRepository.save(desc);
            }

            // Descripciones técnicas extra con código
            DescripcionTecnica desc1 = newDescripcionTecnica(sqli, Nivel.FACIL,
                "El código concatena directamente los datos del usuario en la consulta SQL, permitiendo inyección.",
                "query = \"SELECT * FROM usuarios WHERE nombre = '\" + username + \"' AND password = '\" + password + \"'\""
            );
            if (desc1 != null) descripcionTecnicaRepository.save(desc1);

            DescripcionTecnica desc2 = newDescripcionTecnica(sqli, Nivel.MEDIO,
                "Aunque se filtran comillas, la consulta sigue sin parametrizarse. Se pueden usar inyecciones sin comillas.",
                "query = \"SELECT * FROM usuarios WHERE nombre = \" + username + \" AND password = \" + password"
            );
            if (desc2 != null) descripcionTecnicaRepository.save(desc2);

            DescripcionTecnica desc3 = newDescripcionTecnica(sqli, Nivel.DIFICIL,
                "Se usan consultas preparadas, pero el backend muestra errores SQL. Técnicas avanzadas como blind/error-based pueden funcionar.",
                "query = \"SELECT * FROM usuarios WHERE nombre = ? AND password = ?\";\nstmt = conn.prepareStatement(query);"
            );
            if (desc3 != null) descripcionTecnicaRepository.save(desc3);

            DescripcionTecnica desc4 = newDescripcionTecnica(sqli, Nivel.IMPOSIBLE,
                "Todas las consultas están parametrizadas y validadas. No es vulnerable a SQLi.",
                "query = \"SELECT * FROM usuarios WHERE nombre = ? AND password = ?\";\nstmt = conn.prepareStatement(query);"
            );
            if (desc4 != null) descripcionTecnicaRepository.save(desc4);
        }

        // --- MÓDULO: Cross-Site Scripting (XSS) ---
        Optional<Modulo> xssOpt = moduloRepository.findByNombre("Cross-Site Scripting (XSS)");
        Modulo xss;
        if (xssOpt.isPresent()) {
            xss = xssOpt.get();
        } else {
            Map<String, Object> xssData = mapper.readValue(
                Files.readString(Paths.get("src/main/resources/informacion/xss/xss_data.json"), StandardCharsets.UTF_8),
                Map.class
            );
            xss = new Modulo();
            xss.setNombre("Cross-Site Scripting (XSS)");
            xss.setDescripcion((String) xssData.get("descripcion"));
            xss.setDescripcionEjercicios((String) xssData.get("descripcionEjercicios"));
            xss.setVideoUrl("https://www.youtube.com/embed/BrjeZ9b4p2A");
            xss.setInfoEntorno("Pulsa el botón para abrir la aplicación vulnerable a XSS.");
            moduloRepository.save(xss);

            // Ejemplo
            Ejemplo xssEjemplo = newEjemplo(xss, "Ejemplo XSS", (String) xssData.get("ejemplo"), "");
            if (xssEjemplo != null) ejemploRepository.save(xssEjemplo);

            // Pistas y soluciones
            Map<String, Map<String, String>> xssPistas = (Map<String, Map<String, String>>) xssData.get("pistas");
            Map<String, Map<String, String>> xssSoluciones = (Map<String, Map<String, String>>) xssData.get("soluciones");
            for (String ejercicio : xssPistas.keySet()) {
                Map<String, String> niveles = xssPistas.get(ejercicio);
                for (String nivel : niveles.keySet()) {
                    Pista pista = newPista(xss, Nivel.valueOf(nivel.toUpperCase()), niveles.get(nivel));
                    if (pista != null) pistaRepository.save(pista);
                }
            }
            for (String ejercicio : xssSoluciones.keySet()) {
                Map<String, String> niveles = xssSoluciones.get(ejercicio);
                for (String nivel : niveles.keySet()) {
                    Solucion solucion = newSolucion(xss, Nivel.valueOf(nivel.toUpperCase()), niveles.get(nivel));
                    if (solucion != null) solucionRepository.save(solucion);
                }
            }
            // Descripciones técnicas
            Map<String, String> xssExplicaciones = (Map<String, String>) xssData.get("explicaciones");
            for (String nivel : xssExplicaciones.keySet()) {
                DescripcionTecnica desc = newDescripcionTecnica(xss, Nivel.valueOf(nivel.toUpperCase()), xssExplicaciones.get(nivel), "");
                if (desc != null) descripcionTecnicaRepository.save(desc);
            }
            // Descripciones técnicas extra con código
            DescripcionTecnica desc1 = newDescripcionTecnica(xss, Nivel.FACIL,
                "El backend muestra el contenido del usuario sin sanitizar ni escapar, permitiendo ejecución de scripts.",
                "return f'<div>{comentario}</div>'"
            );
            if (desc1 != null) descripcionTecnicaRepository.save(desc1);

            DescripcionTecnica desc2 = newDescripcionTecnica(xss, Nivel.MEDIO,
                "El frontend elimina solo <script>, pero permite otros vectores como onerror en imágenes.",
                "comentario = comentario.replace('<script>', '').replace('</script>', '')"
            );
            if (desc2 != null) descripcionTecnicaRepository.save(desc2);

            DescripcionTecnica desc3 = newDescripcionTecnica(xss, Nivel.DIFICIL,
                "El escape básico impide la ejecución de etiquetas HTML, pero podrías intentar vectores SVG.",
                "comentario = escape_html(comentario)"
            );
            if (desc3 != null) descripcionTecnicaRepository.save(desc3);

            DescripcionTecnica desc4 = newDescripcionTecnica(xss, Nivel.IMPOSIBLE,
                "El backend escapa y valida todo, no es posible XSS.",
                "comentario = escape_html(comentario); // Validación estricta"
            );
            if (desc4 != null) descripcionTecnicaRepository.save(desc4);
        }

        // --- MÓDULO: CSRF ---
        Optional<Modulo> csrfOpt = moduloRepository.findByNombre("Cross-Site Request Forgery (CSRF)");
        Modulo csrf;
        if (csrfOpt.isPresent()) {
            csrf = csrfOpt.get();
        } else {
            Map<String, Object> csrfData = mapper.readValue(
                Files.readString(Paths.get("src/main/resources/informacion/csrf/csrf_data.json"), StandardCharsets.UTF_8),
                Map.class
            );
            csrf = new Modulo();
            csrf.setNombre("Cross-Site Request Forgery (CSRF)");
            csrf.setDescripcion((String) csrfData.get("descripcion"));
            csrf.setDescripcionEjercicios((String) csrfData.get("descripcionEjercicios"));
            csrf.setVideoUrl("https://www.youtube.com/embed/6jI8vruj6jY");
            csrf.setInfoEntorno("Pulsa el botón para abrir la aplicación vulnerable a CSRF.");
            moduloRepository.save(csrf);

            Ejemplo csrfEjemplo = newEjemplo(csrf, "Ejemplo CSRF", (String) csrfData.get("ejemplo"), "");
            if (csrfEjemplo != null) ejemploRepository.save(csrfEjemplo);

            Map<String, Map<String, String>> csrfPistas = (Map<String, Map<String, String>>) csrfData.get("pistas");
            Map<String, Map<String, String>> csrfSoluciones = (Map<String, Map<String, String>>) csrfData.get("soluciones");
            for (String ejercicio : csrfPistas.keySet()) {
                Map<String, String> niveles = csrfPistas.get(ejercicio);
                for (String nivel : niveles.keySet()) {
                    Pista pista = newPista(csrf, Nivel.valueOf(nivel.toUpperCase()), niveles.get(nivel));
                    if (pista != null) pistaRepository.save(pista);
                }
            }
            for (String ejercicio : csrfSoluciones.keySet()) {
                Map<String, String> niveles = csrfSoluciones.get(ejercicio);
                for (String nivel : niveles.keySet()) {
                    Solucion solucion = newSolucion(csrf, Nivel.valueOf(nivel.toUpperCase()), niveles.get(nivel));
                    if (solucion != null) solucionRepository.save(solucion);
                }
            }
            Map<String, String> csrfExplicaciones = (Map<String, String>) csrfData.get("explicaciones");
            for (String nivel : csrfExplicaciones.keySet()) {
                DescripcionTecnica desc = newDescripcionTecnica(csrf, Nivel.valueOf(nivel.toUpperCase()), csrfExplicaciones.get(nivel), "");
                if (desc != null) descripcionTecnicaRepository.save(desc);
            }
            // Descripciones técnicas extra con código
            DescripcionTecnica desc1 = newDescripcionTecnica(csrf, Nivel.FACIL,
                "No se implementa ninguna protección CSRF. Cualquier petición POST válida con la cookie de sesión será aceptada.",
                "def cambiar_email():\n    email = request.form['email']\n    user = get_current_user()\n    user.email = email\ndb.session.commit()"
            );
            if (desc1 != null) descripcionTecnicaRepository.save(desc1);

            DescripcionTecnica desc2 = newDescripcionTecnica(csrf, Nivel.MEDIO,
                "El backend exige un token CSRF, pero es predecible o reutilizable.",
                "if request.form['csrf_token'] == session['csrf_token']:\n    # ...cambiar email..."
            );
            if (desc2 != null) descripcionTecnicaRepository.save(desc2);

            DescripcionTecnica desc3 = newDescripcionTecnica(csrf, Nivel.DIFICIL,
                "El backend exige un token CSRF único por sesión, pero no valida el Referer.",
                "if request.form['csrf_token'] == session['csrf_token']:\n    # ...cambiar email...\n# Falta validación Referer"
            );
            if (desc3 != null) descripcionTecnicaRepository.save(desc3);

            DescripcionTecnica desc4 = newDescripcionTecnica(csrf, Nivel.IMPOSIBLE,
                "El backend exige un token CSRF robusto y verifica el Referer. No puedes realizar el ataque.",
                "if request.form['csrf_token'] == session['csrf_token'] and request.headers['Referer'] == expected_url:\n    # ...cambiar email..."
            );
            if (desc4 != null) descripcionTecnicaRepository.save(desc4);
        }

        // --- MÓDULO: BAC ---
        Optional<Modulo> bacOpt = moduloRepository.findByNombre("Broken Access Control (BAC)");
        Modulo bac;
        if (bacOpt.isPresent()) {
            bac = bacOpt.get();
        } else {
            Map<String, Object> bacData = mapper.readValue(
                Files.readString(Paths.get("src/main/resources/informacion/bac/bac_data.json"), StandardCharsets.UTF_8),
                Map.class
            );
            bac = new Modulo();
            bac.setNombre("Broken Access Control (BAC)");
            bac.setDescripcion((String) bacData.get("descripcion"));
            bac.setDescripcionEjercicios((String) bacData.get("descripcionEjercicios"));
            bac.setVideoUrl("https://www.youtube.com/embed/8ZtInClXe1Q");
            bac.setInfoEntorno("Pulsa el botón para abrir la aplicación vulnerable a BAC.");
            moduloRepository.save(bac);

            Ejemplo bacEjemplo = newEjemplo(bac, "Ejemplo BAC", (String) bacData.get("ejemplo"), "");
            if (bacEjemplo != null) ejemploRepository.save(bacEjemplo);

            Map<String, String> bacPistas = (Map<String, String>) bacData.get("pistas");
            Map<String, String> bacSoluciones = (Map<String, String>) bacData.get("soluciones");
            for (String nivel : bacPistas.keySet()) {
                Pista pista = newPista(bac, Nivel.valueOf(nivel.toUpperCase()), bacPistas.get(nivel));
                if (pista != null) pistaRepository.save(pista);
            }
            for (String nivel : bacSoluciones.keySet()) {
                Solucion solucion = newSolucion(bac, Nivel.valueOf(nivel.toUpperCase()), bacSoluciones.get(nivel));
                if (solucion != null) solucionRepository.save(solucion);
            }
            Map<String, String> bacExplicaciones = (Map<String, String>) bacData.get("explicaciones");
            for (String nivel : bacExplicaciones.keySet()) {
                DescripcionTecnica desc = newDescripcionTecnica(bac, Nivel.valueOf(nivel.toUpperCase()), bacExplicaciones.get(nivel), "");
                if (desc != null) descripcionTecnicaRepository.save(desc);
            }
            // Descripciones técnicas extra con código
            DescripcionTecnica desc1 = newDescripcionTecnica(bac, Nivel.FACIL,
                "El backend no realiza ninguna comprobación de permisos. Cualquier usuario puede acceder o modificar los datos de cualquier otro usuario simplemente cambiando el parámetro id en la URL o petición.",
                "@app.route('/admin/usuarios')\ndef admin_usuarios():\n    # No hay comprobación de permisos"
            );
            if (desc1 != null) descripcionTecnicaRepository.save(desc1);

            DescripcionTecnica desc2 = newDescripcionTecnica(bac, Nivel.MEDIO,
                "El frontend oculta opciones, pero el backend sigue sin comprobar permisos. Un atacante puede modificar el parámetro id en la petición y acceder a datos ajenos.",
                "if not is_admin(user):\n    return 'Acceso denegado'"
            );
            if (desc2 != null) descripcionTecnicaRepository.save(desc2);

            DescripcionTecnica desc3 = newDescripcionTecnica(bac, Nivel.DIFICIL,
                "El backend solo permite modificar tu propio perfil, pero puedes ver los de otros usuarios.",
                "if request.user.id != requested_id:\n    return 'Acceso denegado para modificar'"
            );
            if (desc3 != null) descripcionTecnicaRepository.save(desc3);

            DescripcionTecnica desc4 = newDescripcionTecnica(bac, Nivel.IMPOSIBLE,
                "El backend comprueba siempre que solo puedes ver y modificar tu propio perfil. No puedes acceder a datos ajenos aunque cambies el parámetro id.",
                "if request.user.id != requested_id:\n    return 'Acceso denegado'"
            );
            if (desc4 != null) descripcionTecnicaRepository.save(desc4);
        }

        // --- MÓDULO: SSRF ---
        Optional<Modulo> ssrfOpt = moduloRepository.findByNombre("Server-Side Request Forgery (SSRF)");
        Modulo ssrf;
        if (ssrfOpt.isPresent()) {
            ssrf = ssrfOpt.get();
        } else {
            Map<String, Object> ssrfData = mapper.readValue(
                Files.readString(Paths.get("src/main/resources/informacion/ssrf/ssrf_data.json"), StandardCharsets.UTF_8),
                Map.class
            );
            ssrf = new Modulo();
            ssrf.setNombre("Server-Side Request Forgery (SSRF)");
            ssrf.setDescripcion((String) ssrfData.get("descripcion"));
            ssrf.setDescripcionEjercicios((String) ssrfData.get("descripcionEjercicios"));
            ssrf.setVideoUrl("https://www.youtube.com/embed/8ZtInClXe1Q");
            ssrf.setInfoEntorno("Pulsa el botón para abrir la aplicación vulnerable a SSRF.");
            moduloRepository.save(ssrf);

            Ejemplo ssrfEjemplo = newEjemplo(ssrf, "Ejemplo SSRF", (String) ssrfData.get("ejemplo"), "");
            if (ssrfEjemplo != null) ejemploRepository.save(ssrfEjemplo);

            Map<String, String> ssrfPistas = (Map<String, String>) ssrfData.get("pistas");
            Map<String, String> ssrfSoluciones = (Map<String, String>) ssrfData.get("soluciones");
            for (String nivel : ssrfPistas.keySet()) {
                Pista pista = newPista(ssrf, Nivel.valueOf(nivel.toUpperCase()), ssrfPistas.get(nivel));
                if (pista != null) pistaRepository.save(pista);
            }
            for (String nivel : ssrfSoluciones.keySet()) {
                Solucion solucion = newSolucion(ssrf, Nivel.valueOf(nivel.toUpperCase()), ssrfSoluciones.get(nivel));
                if (solucion != null) solucionRepository.save(solucion);
            }
            Map<String, String> ssrfExplicaciones = (Map<String, String>) ssrfData.get("explicaciones");
            for (String nivel : ssrfExplicaciones.keySet()) {
                DescripcionTecnica desc = newDescripcionTecnica(ssrf, Nivel.valueOf(nivel.toUpperCase()), ssrfExplicaciones.get(nivel), "");
                if (desc != null) descripcionTecnicaRepository.save(desc);
            }
            // Descripciones técnicas extra con código
            DescripcionTecnica desc1 = newDescripcionTecnica(ssrf, Nivel.FACIL,
                "El backend no valida la URL proporcionada por el usuario. Puedes acceder a cualquier recurso interno o externo.",
                "url = request.args.get('url')\nresp = requests.get(url)"
            );
            if (desc1 != null) descripcionTecnicaRepository.save(desc1);

            DescripcionTecnica desc2 = newDescripcionTecnica(ssrf, Nivel.MEDIO,
                "El backend bloquea algunas IPs privadas, pero puedes probar variantes como 127.0.0.1, localhost, o notaciones hexadecimales.",
                "if is_private_ip(url):\n    return 'Prohibido'"
            );
            if (desc2 != null) descripcionTecnicaRepository.save(desc2);

            DescripcionTecnica desc3 = newDescripcionTecnica(ssrf, Nivel.DIFICIL,
                "El backend bloquea rangos privados y metadatos cloud, pero aún puedes intentar técnicas de evasión avanzadas.",
                "if is_private_ip(url) or is_cloud_metadata(url):\n    return 'Prohibido'"
            );
            if (desc3 != null) descripcionTecnicaRepository.save(desc3);

            DescripcionTecnica desc4 = newDescripcionTecnica(ssrf, Nivel.IMPOSIBLE,
                "Solo se permiten imágenes de Unsplash. Cualquier otro destino será bloqueado.",
                "if not url.startswith('https://images.unsplash.com/'):\n    return 'Prohibido'"
            );
            if (desc4 != null) descripcionTecnicaRepository.save(desc4);
        }

        // --- MÓDULO: Broken Authentication ---
        Optional<Modulo> brokenAuthOpt = moduloRepository.findByNombre("Broken Authentication");
        Modulo brokenAuth;
        if (brokenAuthOpt.isPresent()) {
            brokenAuth = brokenAuthOpt.get();
        } else {
            Map<String, Object> brokenAuthData = mapper.readValue(
                Files.readString(Paths.get("src/main/resources/informacion/broken_auth/broken_auth_data.json"), StandardCharsets.UTF_8),
                Map.class
            );
            brokenAuth = new Modulo();
            brokenAuth.setNombre("Broken Authentication");
            brokenAuth.setDescripcion((String) brokenAuthData.get("descripcion"));
            brokenAuth.setDescripcionEjercicios((String) brokenAuthData.get("descripcionEjercicios"));
            brokenAuth.setVideoUrl("https://www.youtube.com/embed/8ZtInClXe1Q");
            brokenAuth.setInfoEntorno("Pulsa el siguiente botón para abrir la aplicación vulnerable a Broken Authentication en una nueva pestaña y realizar el ejercicio.");
            moduloRepository.save(brokenAuth);

            Ejemplo brokenAuthEjemplo = newEjemplo(brokenAuth, "Ejemplo Broken Authentication", (String) brokenAuthData.get("ejemplo"), "");
            if (brokenAuthEjemplo != null) ejemploRepository.save(brokenAuthEjemplo);

            Map<String, String> brokenAuthPistas = (Map<String, String>) brokenAuthData.get("pistas");
            Map<String, String> brokenAuthSoluciones = (Map<String, String>) brokenAuthData.get("soluciones");
            for (String nivel : brokenAuthPistas.keySet()) {
                Pista pista = newPista(brokenAuth, Nivel.valueOf(nivel.toUpperCase()), brokenAuthPistas.get(nivel));
                if (pista != null) pistaRepository.save(pista);
            }
            for (String nivel : brokenAuthSoluciones.keySet()) {
                Solucion solucion = newSolucion(brokenAuth, Nivel.valueOf(nivel.toUpperCase()), brokenAuthSoluciones.get(nivel));
                if (solucion != null) solucionRepository.save(solucion);
            }
            Map<String, String> brokenAuthExplicaciones = (Map<String, String>) brokenAuthData.get("explicaciones");
            for (String nivel : brokenAuthExplicaciones.keySet()) {
                DescripcionTecnica desc = newDescripcionTecnica(brokenAuth, Nivel.valueOf(nivel.toUpperCase()), brokenAuthExplicaciones.get(nivel), "");
                if (desc != null) descripcionTecnicaRepository.save(desc);
            }
            // Descripciones técnicas extra con código
            DescripcionTecnica desc1 = newDescripcionTecnica(brokenAuth, Nivel.FACIL,
                "El sistema muestra mensajes distintos y no limita los intentos de login, permitiendo enumerar usuarios y fuerza bruta.",
                "if not user:\n    return 'Usuario no encontrado'\nif not check_password(user, password):\n    return 'Contraseña incorrecta'"
            );
            if (desc1 != null) descripcionTecnicaRepository.save(desc1);

            DescripcionTecnica desc2 = newDescripcionTecnica(brokenAuth, Nivel.MEDIO,
                "El backend muestra siempre el mismo mensaje de error, pero no hay límite de intentos.",
                "if not user or not check_password(user, password):\n    return 'Credenciales incorrectas'"
            );
            if (desc2 != null) descripcionTecnicaRepository.save(desc2);

            DescripcionTecnica desc3 = newDescripcionTecnica(brokenAuth, Nivel.DIFICIL,
                "El backend limita el número de intentos de login. Tras varios fallos, bloquea temporalmente el acceso.",
                "if too_many_attempts(user):\n    return 'Acceso bloqueado temporalmente'"
            );
            if (desc3 != null) descripcionTecnicaRepository.save(desc3);

            DescripcionTecnica desc4 = newDescripcionTecnica(brokenAuth, Nivel.IMPOSIBLE,
                "El backend muestra mensajes genéricos, limita los intentos y añade captcha tras varios fallos. Además, exige contraseñas fuertes.",
                "// Implementación con captcha y contraseñas fuertes"
            );
            if (desc4 != null) descripcionTecnicaRepository.save(desc4);
        }

        // --- PREGUNTAS QUIZ CÓDIGO ---
        List<Map<String, Object>> quizData = mapper.readValue(
            Files.readString(Paths.get("src/main/resources/informacion/quizData.json"), StandardCharsets.UTF_8),
            new TypeReference<List<Map<String, Object>>>() {}
        );

        for (Map<String, Object> quiz : quizData) {
            String titulo = (String) quiz.get("title");
            String tipo = (String) quiz.get("type");
            Modulo modulo = null;
            if ("sqli".equals(tipo)) modulo = sqli;
            else if ("xss".equals(tipo)) modulo = xss;
            else if ("csrf".equals(tipo)) modulo = csrf;
            else if ("bac".equals(tipo)) modulo = bac;
            else if ("ssrf".equals(tipo)) modulo = ssrf;
            else if ("broken_auth".equals(tipo)) modulo = brokenAuth;

            if (modulo != null && !preguntaQuizCodigoRepository.existsByTituloAndModulo(titulo, modulo)) {
                PreguntaQuizCodigo pregunta = new PreguntaQuizCodigo();
                pregunta.setTitulo(titulo);
                pregunta.setCodigo((List<String>) quiz.get("code"));
                pregunta.setVulnerableLine((Integer) quiz.get("vulnerableLine"));
                pregunta.setExplicacion((String) quiz.get("explanation"));
                pregunta.setModulo(modulo);
                preguntaQuizCodigoRepository.save(pregunta);
            }
        }

        // --- PREGUNTAS TEÓRICAS ---
        List<Map<String, Object>> preguntasTeoricas = mapper.readValue(
            Files.readString(Paths.get("src/main/resources/informacion/preguntas_teoricas.json"), StandardCharsets.UTF_8),
            new TypeReference<List<Map<String, Object>>>() {}
        );

        for (Map<String, Object> preguntaJson : preguntasTeoricas) {
            String preguntaTexto = (String) preguntaJson.get("pregunta");
            String moduloId = (String) preguntaJson.get("modulo");
            Modulo modulo = null;
            if ("sqli".equals(moduloId)) modulo = sqli;
            else if ("xss".equals(moduloId)) modulo = xss;
            else if ("csrf".equals(moduloId)) modulo = csrf;
            else if ("bac".equals(moduloId)) modulo = bac;
            else if ("ssrf".equals(moduloId)) modulo = ssrf;
            else if ("broken_auth".equals(moduloId)) modulo = brokenAuth;

            if (modulo != null && !preguntaTeoricaRepository.existsByPreguntaAndModulo(preguntaTexto, modulo)) {
                PreguntaTeorica pregunta = new PreguntaTeorica();
                pregunta.setPregunta(preguntaTexto);
                pregunta.setOpciones((List<String>) preguntaJson.get("opciones"));
                pregunta.setRespuesta((String) preguntaJson.get("respuesta"));
                pregunta.setModulo(modulo);
                preguntaTeoricaRepository.save(pregunta);
            }
        }
    }

    private Pista newPista(Modulo modulo, Nivel nivel, String texto) {
        if (pistaRepository.existsByModuloAndNivelAndTexto(modulo, nivel, texto)) return null;
        Pista p = new Pista();
        p.setModulo(modulo);
        p.setNivel(nivel);
        p.setTexto(texto);
        return p;
    }

    private Solucion newSolucion(Modulo modulo, Nivel nivel, String texto) {
        if (solucionRepository.existsByModuloAndNivelAndTexto(modulo, nivel, texto)) return null;
        Solucion s = new Solucion();
        s.setModulo(modulo);
        s.setNivel(nivel);
        s.setTexto(texto);
        return s;
    }

    private DescripcionTecnica newDescripcionTecnica(Modulo modulo, Nivel nivel, String descripcion, String codigoEjemplo) {
        if (descripcionTecnicaRepository.existsByModuloAndNivelAndDescripcion(modulo, nivel, descripcion)) return null;
        DescripcionTecnica d = new DescripcionTecnica();
        d.setModulo(modulo);
        d.setNivel(nivel);
        d.setDescripcion(descripcion);
        d.setCodigoEjemplo(codigoEjemplo);
        return d;
    }

    private Ejemplo newEjemplo(Modulo modulo, String titulo, String descripcion, String codigo) {
        if (ejemploRepository.existsByModuloAndTitulo(modulo, titulo)) return null;
        Ejemplo e = new Ejemplo();
        e.setModulo(modulo);
        e.setTitulo(titulo);
        e.setDescripcion(descripcion);
        e.setCodigo(codigo);
        return e;
    }
}