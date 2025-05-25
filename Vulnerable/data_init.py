import sqlite3
import os
import random
from faker import Faker
import requests

# Configura tu clave de acceso a la API de Unsplash
UNSPLASH_ACCESS_KEY = "6wHMMBjcfghPqj8DHHGpdC_PSNgXiBhDHGrMFEM8uzA"  # 👈️ Reemplaza esto por tu clave real

# Crear carpeta 'db' si no existe
os.makedirs('db', exist_ok=True)

# Inicializar Faker
fake = Faker()

# Conectar o crear la base de datos
conn = sqlite3.connect('db/tienda.db')
cursor = conn.cursor()

# Diccionario de palabras clave para imágenes por categoría
keywords = {
    "Electrónica": "electronics product",
    "Ropa": "fashion clothing",
    "Hogar": "home decor",
    "Deportes": "sports gear",
    "Libros": "bookshelf novel",
    "Juguetes": "kids toys",
    "Oculta": "mystery hidden"
}

# Función para obtener imagen desde la API de Unsplash
def obtener_imagen_desde_unsplash(query):
    url = f"https://api.unsplash.com/photos/random?query= {query}&client_id={UNSPLASH_ACCESS_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data['urls']['regular']
    except Exception as e:
        print(f"Error al obtener imagen para '{query}': {e}")
    # Fallback en caso de fallo
    return "https://via.placeholder.com/300x200.png?text=Sin+Imagen "

# Crear tabla de usuarios
cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    ciudad TEXT,
    fecha_registro DATE
)
''')

# Crear tabla de productos con columna imagen
cursor.execute('''
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria TEXT,
    stock INTEGER,
    imagen TEXT
)
''')

# Función para generar usuarios ficticios
def generar_usuarios(n=10):
    usuarios = []
    for _ in range(n):
        nombre = fake.name()
        email = fake.email()
        ciudad = fake.city()
        fecha_registro = fake.date_between(start_date='-1y', end_date='today')
        usuarios.append((nombre, email, ciudad, fecha_registro))
    return usuarios

# Función para generar productos ficticios con imagen real desde Unsplash
def generar_productos(n=20):
    categorias = list(keywords.keys())  # Usar todas las categorías definidas
    productos = []
    for _ in range(n):
        nombre = fake.word().capitalize() + " " + random.choice(['Pro', 'Plus', 'Max', 'Ultra', 'Mini'])
        precio = round(random.uniform(5, 500), 2)
        categoria = random.choice(categorias)
        stock = random.randint(0, 100)
        keyword = keywords[categoria].strip().replace(" ", "+")
        
        # Obtener imagen real desde la API de Unsplash
        imagen = obtener_imagen_desde_unsplash(keyword)

        productos.append((nombre, precio, categoria, stock, imagen))
    return productos

# Insertar usuarios
usuarios = generar_usuarios(10)
cursor.executemany('''
INSERT INTO usuarios (nombre, email, ciudad, fecha_registro)
VALUES (?, ?, ?, ?)
''', usuarios)

# Insertar productos normales
productos = generar_productos(20)
cursor.executemany('''
INSERT INTO productos (nombre, precio, categoria, stock, imagen)
VALUES (?, ?, ?, ?, ?)
''', productos)

# Insertar productos de categoría "Oculta" con imágenes específicas
productos_ocultos = [
    ("Libro Hacker", 99.99, "Oculta", 5, obtener_imagen_desde_unsplash("hacker")),
    ("Camiseta SQLi", 49.99, "Oculta", 10, obtener_imagen_desde_unsplash("tshirt hacker")),
    ("Router Pro", 199.99, "Oculta", 2, obtener_imagen_desde_unsplash("router networking"))
]
cursor.executemany('''
INSERT INTO productos (nombre, precio, categoria, stock, imagen)
VALUES (?, ?, ?, ?, ?)
''', productos_ocultos)

# Guardar cambios y cerrar conexión
conn.commit()
conn.close()

print("✅ Base de datos creada exitosamente con imágenes válidas desde Unsplash.")