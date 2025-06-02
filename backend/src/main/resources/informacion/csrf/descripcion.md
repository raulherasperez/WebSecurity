# Módulo 3: Cross-Site Request Forgery (CSRF)

**Cross-Site Request Forgery (CSRF)** es una vulnerabilidad que permite a un atacante realizar acciones en nombre de un usuario autenticado en una aplicación web, sin su consentimiento. 
El atacante engaña al navegador de la víctima para que envíe peticiones no deseadas (como transferencias de dinero, cambios de contraseña o borrado de datos) usando la sesión activa del usuario.

CSRF explota el hecho de que los navegadores envían automáticamente las cookies de sesión con cada petición al dominio correspondiente, sin importar desde dónde se originó la petición. 
Si la aplicación no implementa mecanismos de protección, un atacante puede crear una página maliciosa que fuerce al navegador de la víctima a ejecutar acciones en la aplicación legítima.

- **Modificar la contraseña de un usuario:** El atacante puede cambiar la contraseña de la víctima si la aplicación no protege el endpoint correspondiente.
- **Realizar transferencias de dinero:** En aplicaciones bancarias, un CSRF puede transferir fondos sin el consentimiento del usuario.
- **Cambiar la dirección de correo electrónico:** El atacante puede secuestrar cuentas cambiando el email asociado.
- **Borrar información:** Puede eliminar datos personales, comentarios o archivos.

**¿Quieres saber más?** Consulta estos recursos recomendados:

- [OWASP: Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
- [PortSwigger Web Security Academy: CSRF](https://portswigger.net/web-security/csrf)
- [Hacksplaining: Ejercicio interactivo de CSRF](https://www.hacksplaining.com/exercises/csrf)
- [MDN Web Docs: CSRF](https://developer.mozilla.org/es/docs/Web/Security/Types_of_attacks#cross-site_request_forgery_csrf)