import pytest
from app import app

@pytest.fixture
def client():
    # Conecta a la base de datos de test
    app.config['DATABASE'] = "db_test/vulnerable_test.db"
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'test'
    with app.test_client() as client:
        yield client

# --- MODULO 1: SQLi ---

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_sqli_login(client, nivel):
    if nivel == "medio":
        payload = "admin OR 1=1 --"
        resp = client.post(f"/vulnerable-login?nivel={nivel}", json={"username": payload, "password": "admin@test.local"})
    else:
        payload = "' OR 1=1 --"
        resp = client.post(f"/vulnerable-login?nivel={nivel}", json={"username": payload, "password": "admin@test.local"})
    data = resp.get_json()
    if nivel in ("facil", "medio"):
        assert resp.status_code in (200, 500)
        if resp.status_code == 200:
            assert data.get("success") is True
    else:
        assert resp.status_code in (401, 400, 500)
        assert data.get("success") is False

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_sqli_productos(client, nivel):
    if nivel == "medio":
        payload = "%' OR 1=1 --"
        resp = client.get(f"/vulnerable-productos?nivel={nivel}&search={payload}")
    else:
        payload = "%' OR 1=1 --"
        resp = client.get(f"/vulnerable-productos?nivel={nivel}&search={payload}")
    data = resp.get_json()
    if nivel in ("facil", "medio"):
        assert resp.status_code in (200, 500)
        assert isinstance(data.get("productos"), list)
        print(data.get("productos"))
        ocultos = [p for p in data["productos"] if p.get("categoria") == "Oculta"]
        assert len(ocultos) > 0
    else:
        assert resp.status_code == 200
        ocultos = [p for p in data["productos"] if p.get("categoria") == "Oculta"]
        assert len(ocultos) == 0

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_sqli_producto_detalle(client, nivel):
    if nivel == "medio":
        payload = "3|1=1"
        resp = client.get(f"/vulnerable-producto?nivel={nivel}&id={payload}")
        
    else:
        payload = "3|1=1"
        resp = client.get(f"/vulnerable-producto?nivel={nivel}&id={payload}")
        print(resp.data)
    data = resp.get_json()
    if nivel in ("facil", "medio"):
        assert resp.status_code in (200, 500)
        assert isinstance(data, dict) and "id" in data
        data = resp.get_json()
        assert data.get("categoria") == "Oculta"
    else:
        assert resp.status_code in (400, 404, 500)

def test_vuln_categorias(client):
    resp = client.get("/vulnerable-categorias")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)

# --- MODULO 3: CSRF ---

def test_foro_comentarios(client):
    resp = client.get("/foro-comentarios")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)

def test_foro_reset_comentarios(client):
    resp = client.post("/foro-reset-comentarios")
    assert resp.status_code == 200
    assert resp.get_json()["success"]

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_foro_agregar_comentario(client, nivel):
    client.post("/set-nivel-csrf", json={"nivel": nivel})
    data = {"texto": "test"}
    headers = {}
    if nivel == "medio":
        headers["Referer"] = "http://localhost:3000"
    if nivel == "dificil":
        data["csrf_token"] = "token123"
    if nivel == "imposible":
        with client.session_transaction() as sess:
            sess["csrf_token"] = "token123"
        data["csrf_token"] = "token123"
        headers["Referer"] = "http://localhost:3000"
    resp = client.post("/foro-agregar-comentario", data=data, headers=headers)
    assert resp.status_code in (200, 400, 403)
    # Puede fallar si falta token/referer

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_foro_borrar_comentario(client, nivel):
    client.post("/set-nivel-csrf", json={"nivel": nivel})
    data = {"id": "1"}
    headers = {}
    if nivel == "medio":
        headers["Referer"] = "http://localhost:3000"
    if nivel == "dificil":
        data["csrf_token"] = "token123"
    if nivel == "imposible":
        with client.session_transaction() as sess:
            sess["csrf_token"] = "token123"
        data["csrf_token"] = "token123"
        headers["Referer"] = "http://localhost:3000"
    resp = client.post("/foro-borrar-comentario", data=data, headers=headers)
    assert resp.status_code in (200, 400, 403)

# --- MODULO 4: BAC ---

def test_get_usuarios(client):
    resp = client.get("/usuarios")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_perfil_usuario_get(client, nivel):
    client.post("/set-nivel-bac", json={"nivel": nivel})
    with client.session_transaction() as sess:
        sess["usuario_id"] = 1
    resp = client.get("/perfil?id=1")
    assert resp.status_code in (200, 403, 400, 404)

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_perfil_usuario_post(client, nivel):
    client.post("/set-nivel-bac", json={"nivel": nivel})
    with client.session_transaction() as sess:
        sess["usuario_id"] = 1
    resp = client.post("/perfil?id=1", data={"email": "nuevo@mail.com"})
    assert resp.status_code in (200, 403, 400)

def test_bac_login_logout_whoami(client):
    # Login
    resp = client.post("/login", data={"usuario": "admin", "password": "admin123"})
    assert resp.status_code in (200, 401)
    # Whoami
    resp = client.get("/whoami")
    assert resp.status_code == 200
    # Logout
    resp = client.post("/logout")
    assert resp.status_code == 200

# --- MODULO 5: SSRF ---

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_ssrf_producto_preview(client, nivel):
    client.post("/set-nivel-ssrf", json={"nivel": nivel})
    if nivel == "facil":
        url = "http://localhost:5001/usuarios"
        resp = client.get(f"/ssrf-producto-preview?url={url}")
        assert resp.status_code == 200
    elif nivel == "medio":
        url = "http://127.1:5001/usuarios"
        resp = client.get(f"/ssrf-producto-preview?url={url}")
        assert resp.status_code in (200, 403, 400, 500)
    elif nivel == "dificil":
        url = "http://192.168.1.10:8080/"
        resp = client.get(f"/ssrf-producto-preview?url={url}")
        assert resp.status_code in (403, 400, 500)
    elif nivel == "imposible":
        url = "http://example.com"
        resp = client.get(f"/ssrf-producto-preview?url={url}")
        assert resp.status_code in (403, 400, 500)

# --- MODULO 6: Broken Authentication ---

@pytest.mark.parametrize("nivel", ["facil", "medio", "dificil", "imposible"])
def test_brokenauth_login(client, nivel):
    client.post("/set-nivel-brokenauth", json={"nivel": nivel})
    data = {"username": "admin", "password": "admin123"}
    if nivel == "imposible":
        # Simular 5 intentos fallidos para requerir captcha
        for _ in range(5):
            client.post("/brokenauth-login", json={"username": "admin", "password": "bad"})
        # Ahora debe pedir captcha
        resp = client.post("/brokenauth-login", json={"username": "admin", "password": "bad"})
        assert resp.status_code in (401, 429)
        # Prueba con captcha correcto
        resp = client.post("/brokenauth-login", json={"username": "admin", "password": "admin123", "captcha": "1234"})
        assert resp.status_code in (200, 401, 429)
    else:
        resp = client.post("/brokenauth-login", json=data)
        assert resp.status_code in (200, 401, 429)

# --- SANDBOX ---

def test_sandbox_login_logout_whoami(client):
    resp = client.post("/sandbox/login?nivel=facil", json={"username": "admin", "password": "admin123"})
    assert resp.status_code in (200, 401)
    resp = client.get("/sandbox/whoami")
    assert resp.status_code == 200
    resp = client.post("/sandbox/logout")
    assert resp.status_code == 200

def test_sandbox_productos(client):
    resp = client.get("/sandbox/productos")
    assert resp.status_code == 200
    assert "productos" in resp.get_json()

def test_sandbox_producto(client):
    resp = client.get("/sandbox/producto/1")
    assert resp.status_code in (200, 404)

def test_sandbox_add_review(client):
    resp = client.post("/sandbox/producto/1/review", json={"autor": "test", "texto": "prueba"})
    assert resp.status_code == 200

def test_sandbox_cambiar_email(client):
    resp = client.post("/sandbox/cambiar-email", data={"username": "admin", "nuevo_email": "nuevo@mail.com"})
    assert resp.status_code == 200

def test_sandbox_admin_usuarios(client):
    resp = client.get("/sandbox/admin/usuarios")
    assert resp.status_code == 200
    assert "usuarios" in resp.get_json()

def test_sandbox_admin_usuario_detalle(client):
    resp = client.get("/sandbox/admin/usuario/1")
    assert resp.status_code in (200, 404)

def test_sandbox_admin_usuario_editar(client):
    resp = client.post("/sandbox/admin/usuario/1/editar", json={"nombre": "nuevo", "email": "nuevo@mail.com", "rol": "user"})
    assert resp.status_code == 200

def test_sandbox_admin_usuario_eliminar(client):
    resp = client.post("/sandbox/admin/usuario/1/eliminar")
    assert resp.status_code == 200