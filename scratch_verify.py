import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# We can test against live Render backend: https://ecommerce-backend-jnt4.onrender.com
BASE_URL = "https://ecommerce-backend-jnt4.onrender.com"

def make_req(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        return e.code, content
    except Exception as e:
        return 500, str(e)

print("1. Checking Server Health / Swagger...")
st, res = make_req("/v3/api-docs")
print(f"Status: {st}, API Title: {res.get('info', {}).get('title') if isinstance(res, dict) else res}")

print("\n2. Testing Admin Login (vibhor_admin)...")
st, res = make_req("/auth/login", "POST", {"username": "vibhor", "password": "password123"})
print(f"Status: {st}, Response: {res}")
admin_token = res.get("token") if isinstance(res, dict) else None

if admin_token:
    print("\n3. Testing GET /api/admin/users (Users Table)...")
    st, users = make_req("/api/admin/users", "GET", token=admin_token)
    print(f"Status: {st}, Total Elements: {users.get('totalElements') if isinstance(users, dict) else users}")
    if isinstance(users, dict) and "content" in users:
        print(f"Users found ({len(users['content'])}): {[u.get('username') for u in users['content']]}")

    print("\n4. Testing GET /api/admin/orders (Admin Orders)...")
    st, orders = make_req("/api/admin/orders", "GET", token=admin_token)
    print(f"Status: {st}, Total Orders: {orders.get('totalElements') if isinstance(orders, dict) else orders}")

    print("\n5. Testing GET /api/admin/inventory (50 Products)...")
    st, inv = make_req("/api/admin/inventory", "GET", token=admin_token)
    print(f"Status: {st}, Total Inventory: {inv.get('totalElements') if isinstance(inv, dict) else inv}")

    print("\n6. Testing GET /api/store/me (Auto-linked profile for admin)...")
    st, profile = make_req("/api/store/me", "GET", token=admin_token)
    print(f"Status: {st}, Profile: {profile}")