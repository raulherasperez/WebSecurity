## Ejercicio: Explota CSRF para borrar comentarios en el foro

**Contexto:** Imagina que participas en un foro online. Puedes borrar tus propios comentarios desde la interfaz, pero la funcionalidad **no está protegida contra CSRF**.
Un atacante podría engañarte para que, al visitar una web maliciosa mientras tienes la sesión iniciada, se envíe una petición para borrar uno de tus comentarios sin tu consentimiento.

Accede al entorno vulnerable del foro y trata de explotar la vulnerabilidad para borrar un comentario tuyo mediante un ataque CSRF.