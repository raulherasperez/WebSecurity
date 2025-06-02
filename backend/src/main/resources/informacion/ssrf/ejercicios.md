## Ejercicio: Explota SSRF para acceder a recursos internos

**Contexto:** Imagina que eres administrador de una tienda online y tienes acceso a un panel de administración donde puedes gestionar productos, usuarios y ver estadísticas. 
El panel incluye una funcionalidad para obtener una **vista previa de la imagen de un producto** a partir de una URL externa. 
Esta funcionalidad es vulnerable a SSRF, ya que el backend descarga cualquier recurso solicitado sin validar el destino.

Tu objetivo es explotar esta funcionalidad para hacer que el servidor acceda a recursos internos o protegidos, demostrando la vulnerabilidad SSRF. 
Puedes hacerlo directamente desde el formulario de vista previa de imagen en el entorno vulnerable, introduciendo URLs internas o de servicios sensibles.