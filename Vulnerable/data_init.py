import sqlite3
import random
from faker import Faker

# Inicializar Faker
fake = Faker()

# Conectar o crear la base de datos
conn = sqlite3.connect('tienda.db')
cursor = conn.cursor()

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

# Crear tabla de productos
cursor.execute('''
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    categoria TEXT,
    stock INTEGER
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

# Función para generar productos ficticios
def generar_productos(n=20):
    categorias = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes']
    productos = []
    for _ in range(n):
        nombre = fake.word().capitalize() + " " + random.choice(['Pro', 'Plus', 'Max', 'Ultra', 'Mini'])
        precio = round(random.uniform(5, 500), 2)
        categoria = random.choice(categorias)
        stock = random.randint(0, 100)
        productos.append((nombre, precio, categoria, stock))
    return productos

# Insertar usuarios
usuarios = generar_usuarios(10)
cursor.executemany('''
INSERT INTO usuarios (nombre, email, ciudad, fecha_registro)
VALUES (?, ?, ?, ?)
''', usuarios)

# Insertar productos
productos = generar_productos(20)
cursor.executemany('''
INSERT INTO productos (nombre, precio, categoria, stock)
VALUES (?, ?, ?, ?)
''', productos)

# Guardar cambios y cerrar conexión
conn.commit()
conn.close()

print("Base de datos creada y poblada exitosamente.")