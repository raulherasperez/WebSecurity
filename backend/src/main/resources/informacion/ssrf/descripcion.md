# Módulo 5: Server-Side Request Forgery (SSRF)

**Server-Side Request Forgery (SSRF)** es una vulnerabilidad que permite a un atacante manipular a un servidor para que realice peticiones HTTP o de otro tipo a recursos internos o externos, normalmente controlando la URL o el destino de la petición. 
Esto puede permitir al atacante acceder a información interna, interactuar con servicios privados, escanear la red interna, o incluso acceder a metadatos sensibles en servicios en la nube.

SSRF ocurre cuando una aplicación web obtiene una URL o dirección de destino desde la entrada del usuario y la utiliza para realizar una petición desde el backend, sin validar adecuadamente el destino. 
Si el atacante puede controlar la URL, puede hacer que el servidor acceda a recursos internos (por ejemplo, `http://localhost`, `http://127.0.0.1`, `http://169.254.169.254` en AWS) o a servicios protegidos por firewalls.

- **Acceso a recursos internos:** El atacante puede leer datos de servicios internos no expuestos públicamente.
- **Escaneo de red interna:** El atacante puede descubrir servicios y puertos abiertos en la red privada.
- **Acceso a metadatos en la nube:** En entornos cloud, puede acceder a endpoints como `169.254.169.254` para obtener credenciales temporales.
- **Bypass de controles de acceso:** El atacante puede acceder a recursos restringidos desde el backend.

**¿Quieres saber más?** Consulta estos recursos recomendados:

- [OWASP: Server-Side Request Forgery (SSRF)](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery)
- [PortSwigger Web Security Academy: SSRF](https://portswigger.net/web-security/ssrf)
- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)