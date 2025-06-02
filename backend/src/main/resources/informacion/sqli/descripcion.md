La **inyección SQL** es una de las vulnerabilidades más peligrosas y frecuentes en aplicaciones web.  
Ocurre cuando una aplicación construye consultas SQL de forma insegura, permitiendo que un usuario malicioso inserte código SQL propio en los campos de entrada (como formularios de login, búsqueda o parámetros en la URL).

Si una aplicación no valida ni filtra correctamente los datos que recibe del usuario, un atacante puede manipular las consultas a la base de datos. Esto puede permitirle:

- Acceder a información confidencial (usuarios, contraseñas, datos personales...)
- Modificar, borrar o insertar datos en la base de datos
- Eludir controles de autenticación y acceder como otro usuario
- Obtener acceso total al sistema en casos graves

Por ejemplo, si un formulario de login construye la consulta SQL directamente con los datos introducidos por el usuario, un atacante podría alterar la lógica de autenticación y acceder sin conocer la contraseña.

En este módulo aprenderás a identificar, explotar y entender el impacto de la inyección SQL, así como a proteger tus aplicaciones frente a este tipo de ataques.

### ¿Quieres saber más?

Consulta estos recursos recomendados:

- [OWASP: SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) 
- [OWASP Cheat Sheet: Prevención de SQL Injection](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) 
- [PortSwigger Web Security Academy: SQL Injection](https://portswigger.net/web-security/sql-injection) 
- [Hacksplaining: Ejercicio interactivo de SQL Injection](https://www.hacksplaining.com/exercises/sql-injection) 