import sqlite3
import os
from datetime import datetime

# Borrar la base de datos de test si existe
if os.path.exists('db_test/vulnerable_test.db'):
    os.remove('db_test/vulnerable_test.db')

# Crear carpeta 'db_test' si no existe
os.makedirs('db_test', exist_ok=True)

# Conectar o crear la base de datos de test
conn = sqlite3.connect('db_test/vulnerable_test.db')
cursor = conn.cursor()

# Crear tablas
cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    ciudad TEXT,
    fecha_registro DATE,
    password TEXT,
    rol TEXT DEFAULT 'usuario'
)
''')

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

cursor.execute('''
CREATE TABLE IF NOT EXISTS foro_comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autor TEXT NOT NULL,
    texto TEXT NOT NULL,
    fecha TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER,
    autor TEXT,
    texto TEXT,
    fecha TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    producto_id INTEGER,
    fecha TEXT
)
''')

# Insertar usuarios deterministas
usuarios = [
    ("admin", "admin@test.local", "Ciudad Test", "2024-01-01", "admin123", "admin"),
    ("victima", "victima@test.local", "Ciudad Test", "2024-01-02", "victima123", "usuario"),
    ("user", "user@test.local", "Ciudad Test", "2024-01-03", "user123", "usuario"),
]
cursor.executemany('''
INSERT INTO usuarios (nombre, email, ciudad, fecha_registro, password, rol)
VALUES (?, ?, ?, ?, ?, ?)
''', usuarios)

# Insertar productos deterministas
productos = [
    ("Producto Test 1", 10.0, "Electrónica", 5, "https://via.placeholder.com/300x200.png?text=Test1"),
    ("Producto Test 2", 20.0, "Ropa", 10, "https://via.placeholder.com/300x200.png?text=Test2"),
    ("Producto Oculto", 99.0, "Oculta", 1, "https://via.placeholder.com/300x200.png?text=Oculto"),
]
cursor.executemany('''
INSERT INTO productos (nombre, precio, categoria, stock, imagen)
VALUES (?, ?, ?, ?, ?)
''', productos)

# Insertar comentarios de foro
comentarios = [
    ("victima", "Comentario de prueba 1", "2024-06-01"),
    ("user", "Comentario de prueba 2", "2024-06-02"),
]
cursor.executemany(
    "INSERT INTO foro_comentarios (autor, texto, fecha) VALUES (?, ?, ?)",
    comentarios
)

# Insertar reviews
reviews = [
    (1, "admin", "Review admin", "2024-06-01 10:00:00"),
    (2, "victima", "Review victima", "2024-06-02 11:00:00"),
]
cursor.executemany(
    "INSERT INTO reviews (producto_id, autor, texto, fecha) VALUES (?, ?, ?, ?)",
    reviews
)

# Insertar compras
compras = [
    (1, 1, "2024-06-01"),
    (2, 2, "2024-06-02"),
]
cursor.executemany(
    "INSERT INTO compras (usuario_id, producto_id, fecha) VALUES (?, ?, ?)",
    compras
)

conn.commit()
conn.close()

print("✅ Base de datos de test creada en db_test/vulnerable_test.db")