# Módulo 2: Cross-Site Scripting (XSS)

**Cross-Site Scripting (XSS)** es una de las vulnerabilidades más comunes y peligrosas en aplicaciones web. Ocurre cuando una aplicación permite que datos no confiables (proporcionados por el usuario) se inserten en una página web sin la validación o el escape adecuado, permitiendo que un atacante inyecte y ejecute código JavaScript malicioso en el navegador de otros usuarios.

Los ataques XSS pueden tener consecuencias graves, como el robo de información sensible, suplantación de identidad, manipulación de la interfaz, redirección a sitios maliciosos, y mucho más. Los atacantes pueden aprovechar XSS para robar cookies de sesión, capturar pulsaciones de teclado, mostrar formularios falsos, modificar el contenido de la página o incluso propagar malware.

- **Robo de información sensible:** como cookies de sesión, tokens de autenticación o datos personales.
- **Modificación del contenido:** el atacante puede alterar la apariencia o el comportamiento de la página para engañar a los usuarios.
- **Redirección a sitios maliciosos:** los usuarios pueden ser enviados a páginas de phishing o descarga de malware.
- **Propagación de gusanos:** en aplicaciones con funcionalidades sociales, un XSS puede propagarse automáticamente a otros usuarios.

**¿Quieres saber más?** Consulta estos recursos recomendados:

- [OWASP: Cross-site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- [PortSwigger Web Security Academy: XSS](https://portswigger.net/web-security/cross-site-scripting)
- [Hacksplaining: Ejercicio interactivo de XSS](https://www.hacksplaining.com/exercises/xss)
- [MDN Web Docs: Tipos de ataques XSS](https://developer.mozilla.org/es/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss)