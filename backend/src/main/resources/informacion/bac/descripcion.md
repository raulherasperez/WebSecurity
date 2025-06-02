# Módulo 4: Broken Access Control (BAC)

**Broken Access Control** es una de las vulnerabilidades más frecuentes y peligrosas en aplicaciones web modernas. Ocurre cuando una aplicación no restringe correctamente el acceso a recursos o acciones, permitiendo a usuarios no autorizados realizar operaciones restringidas. 
Esto puede deberse a la ausencia de comprobaciones de permisos, validaciones insuficientes en el backend o confiar únicamente en el frontend para controlar el acceso.

Las consecuencias de Broken Access Control pueden ser muy graves: exposición de datos sensibles, modificación o borrado de información de otros usuarios, escalada de privilegios, acceso a funcionalidades administrativas, entre otros. 
Es una de las principales causas de brechas de seguridad y está en el puesto #1 del [OWASP Top 10](https://owasp.org/Top10/A01_2021-Broken_Access_Control/).

- **Acceso a datos de otros usuarios:** Ver o modificar información personal ajena.
- **Escalada de privilegios:** Obtener permisos de administrador o acceder a funciones restringidas.
- **Modificación o borrado de recursos ajenos:** Cambiar o eliminar datos de otros usuarios.
- **Acceso a paneles de administración:** Entrar en áreas reservadas sin autorización.

**¿Quieres saber más?** Consulta estos recursos recomendados:

- [OWASP Top 10: Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [PortSwigger Web Security Academy: Access Control](https://portswigger.net/web-security/access-control)
- [OWASP Access Control Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)