## Ejercicio 1: Login vulnerable

El primer paso para acceder a la tienda es iniciar sesión. El formulario de login es vulnerable a inyección SQL,  
lo que significa que puedes acceder como cualquier usuario sin conocer su contraseña real.

## Ejercicio 2: Filtros avanzados vulnerables

Utiliza los filtros de búsqueda (nombre, categoría) en el catálogo. Todos los filtros son vulnerables a inyección SQL.  
¿Podrás encontrar productos ocultos o manipular los resultados?

## Ejercicio 3: Detalles de producto vulnerables

Una vez dentro, puedes ver el catálogo de productos. Si haces clic en un producto, accederás a una pantalla de detalle.

Sin embargo, los productos de la categoría "Oculta" no son visibles a menos que manipules la URL.

El endpoint que obtiene los detalles es vulnerable a inyección SQL, así que puedes manipular el parámetro `id` en la URL para intentar acceder a productos ocultos o a información de otros productos.