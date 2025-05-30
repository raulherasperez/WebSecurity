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
conn = sqlite3.connect('db/vulnerable.db')
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
    url = f"https://api.unsplash.com/photos/random?query={query}&client_id={UNSPLASH_ACCESS_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data['urls']['regular']
    except Exception as e:
        print(f"Error al obtener imagen para '{query}': {e}")
    # Fallback en caso de fallo
    return "https://via.placeholder.com/300x200.png?text=Sin+Imagen"

# Crear tabla de usuarios con columna password
cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    ciudad TEXT,
    fecha_registro DATE,
    password TEXT
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

# Función para generar usuarios ficticios con contraseña
def generar_usuarios(n=10):
    usuarios = []
    for _ in range(n):
        nombre = fake.name()
        email = fake.email()
        ciudad = fake.city()
        fecha_registro = fake.date_between(start_date='-1y', end_date='today')
        password = fake.password(length=10)
        usuarios.append((nombre, email, ciudad, fecha_registro, password))
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

# Insertar usuario víctima para CSRF (si no existe)
cursor.execute('''
INSERT OR IGNORE INTO usuarios (nombre, email, ciudad, fecha_registro, password)
VALUES (?, ?, ?, ?, ?)
''', (
    'victima',
    'victima@demo.local',
    'Ciudad Demo',
    fake.date_between(start_date='-1y', end_date='today'),
    'victima123'  # Contraseña original
))

cursor.execute('''
INSERT OR IGNORE INTO usuarios (nombre, email, ciudad, fecha_registro, password)
VALUES (?, ?, ?, ?, ?)
''', (
    'John',
    'john@email.com',
    'Ciudad John',
    fake.date_between(start_date='-1y', end_date='today'),
    'john'  # Contraseña original
))

# Insertar usuarios aleatorios con contraseña
usuarios = generar_usuarios(10)
cursor.executemany('''
INSERT INTO usuarios (nombre, email, ciudad, fecha_registro, password)
VALUES (?, ?, ?, ?, ?)
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

cursor.execute('''
CREATE TABLE IF NOT EXISTS foro_comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autor TEXT NOT NULL,
    texto TEXT NOT NULL,
    fecha TEXT NOT NULL
)
''')

# Insertar comentarios iniciales (borrar antes si existen)
cursor.execute("DELETE FROM foro_comentarios")
comentarios_iniciales = [
    ("victima", "¡Hola a todos! Este es mi primer comentario.", "2024-05-01"),
    ("alice", "Bienvenido al foro, victima.", "2024-05-02"),
    ("bob", "¿Alguien ha probado la nueva funcionalidad?", "2024-05-03"),
    ("victima", "Sí, funciona bastante bien.", "2024-05-04"),
]
cursor.executemany(
    "INSERT INTO foro_comentarios (autor, texto, fecha) VALUES (?, ?, ?)",
    comentarios_iniciales
)

cursor.execute('''
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER,
    autor TEXT,
    texto TEXT,
    fecha TEXT
)
''')

# --- Inicializar reviews de ejemplo para productos del sandbox ---
def generar_reviews(productos, usuarios, n=30):
    reviews = []
    for _ in range(n):
        producto = random.choice(productos)
        autor = random.choice(usuarios)[0]  # nombre del usuario
        texto = fake.sentence(nb_words=12)
        fecha = fake.date_between(start_date='-1y', end_date='today').strftime('%Y-%m-%d %H:%M:%S')
        reviews.append((producto[0], autor, texto, fecha))  # producto_id, autor, texto, fecha
    return reviews

# Obtener IDs de productos y nombres de usuarios para reviews
cursor.execute("SELECT id FROM productos")
producto_ids = [row[0] for row in cursor.fetchall()]
cursor.execute("SELECT nombre FROM usuarios")
usuario_nombres = [(row[0],) for row in cursor.fetchall()]

# Si hay productos y usuarios, insertar reviews de ejemplo
if producto_ids and usuario_nombres:
    # Emparejar producto_id con nombre de usuario
    productos_para_reviews = [(pid,) for pid in producto_ids]
    reviews = []
    for _ in range(30):
        producto_id = random.choice(producto_ids)
        autor = random.choice(usuario_nombres)[0]
        texto = fake.sentence(nb_words=12)
        fecha = fake.date_between(start_date='-1y', end_date='today').strftime('%Y-%m-%d %H:%M:%S')
        reviews.append((producto_id, autor, texto, fecha))
    cursor.executemany('''
        INSERT INTO reviews (producto_id, autor, texto, fecha)
        VALUES (?, ?, ?, ?)
    ''', reviews)

cursor.execute("PRAGMA table_info(usuarios)")
cols = [col[1] for col in cursor.fetchall()]
if 'rol' not in cols:
    cursor.execute("ALTER TABLE usuarios ADD COLUMN rol TEXT DEFAULT 'usuario'")

# Crear tabla de compras
cursor.execute('''
CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    producto_id INTEGER,
    fecha TEXT
)
''')

# Insertar roles y compras de ejemplo
cursor.execute("UPDATE usuarios SET rol = 'admin' WHERE nombre = 'John'")
cursor.execute("UPDATE usuarios SET rol = 'usuario' WHERE nombre != 'John'")

# Insertar compras aleatorias
cursor.execute("SELECT id FROM usuarios")
usuario_ids = [row[0] for row in cursor.fetchall()]
cursor.execute("SELECT id FROM productos")
producto_ids = [row[0] for row in cursor.fetchall()]
compras = []
for _ in range(30):
    usuario_id = random.choice(usuario_ids)
    producto_id = random.choice(producto_ids)
    fecha = fake.date_between(start_date='-1y', end_date='today').strftime('%Y-%m-%d')
    compras.append((usuario_id, producto_id, fecha))
cursor.executemany(
    "INSERT INTO compras (usuario_id, producto_id, fecha) VALUES (?, ?, ?)",
    compras
)

# Guardar cambios y cerrar conexión
conn.commit()
conn.close()

print("✅ Base de datos creada exitosamente con imágenes válidas desde Unsplash y contraseñas para todos los usuarios.")