import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

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
        try:
            return e.code, json.loads(content)
        except:
            return e.code, content
    except Exception as e:
        return 500, str(e)

print("--- 1. Testing USER (vibhor) Endpoints ---")
st, res = make_req("/auth/login", "POST", {"username": "vibhor", "password": "password123"})
print(f"Login vibhor: {st} -> role: {res.get('role') if isinstance(res, dict) else res}")
user_token = res.get("token")

if user_token:
    st, me = make_req("/api/store/me", "GET", token=user_token)
    print(f"GET /api/store/me: {st} -> Customer ID: {me.get('customerId')}, Name: {me.get('firstName')} {me.get('lastName')}")

    st, prods = make_req("/api/store/products?size=5", "GET", token=user_token)
    print(f"GET /api/store/products: {st} -> Total Products: {prods.get('totalElements')}")

    st, orders = make_req("/api/store/orders", "GET", token=user_token)
    print(f"GET /api/store/orders: {st} -> Orders count: {orders.get('totalElements')}")

    st, cart = make_req("/api/store/cart", "GET", token=user_token)
    print(f"GET /api/store/cart: {st} -> Cart items: {len(cart.get('items', [])) if isinstance(cart, dict) else cart}")

print("\n--- 2. Testing / Registering ADMIN (vibhor_admin) ---")
# Try registering vibhor_admin if not already registered
st, reg = make_req("/auth/register", "POST", {
    "username": "vibhor_admin",
    "password": "password123",
    "role": "ADMIN",
    "firstName": "Vibhor",
    "lastName": "Admin",
    "email": "vibhor_admin@aci-commerce.internal",
    "city": "Mumbai"
})
print(f"Register vibhor_admin: {st} -> {reg}")

st, admin_login = make_req("/auth/login", "POST", {"username": "vibhor_admin", "password": "password123"})
print(f"Login vibhor_admin: {st} -> role: {admin_login.get('role') if isinstance(admin_login, dict) else admin_login}")
admin_token = admin_login.get("token") if isinstance(admin_login, dict) else None

if admin_token:
    print("\n--- 3. Testing ADMIN Endpoints with vibhor_admin ---")
    st, users = make_req("/api/admin/users", "GET", token=admin_token)
    print(f"GET /api/admin/users: {st} -> Total Users: {users.get('totalElements') if isinstance(users, dict) else users}")
    if isinstance(users, dict) and "content" in users:
        for u in users["content"]:
            print(f"  - User ID: {u.get('userId')}, Username: {u.get('username')}, Role: {u.get('role')}, LinkedCustomer: {u.get('linkedCustomer')}, Email: {u.get('customerEmail')}")

    st, adm_orders = make_req("/api/admin/orders", "GET", token=admin_token)
    print(f"\nGET /api/admin/orders: {st} -> Total Orders: {adm_orders.get('totalElements') if isinstance(adm_orders, dict) else adm_orders}")
    if isinstance(adm_orders, dict) and "content" in adm_orders:
        for o in adm_orders["content"][:3]:
            print(f"  - Order #{o.get('orderId')}, Customer: {o.get('customerName')}, Amount: ₹{o.get('totalAmount')}, Status: {o.get('status')}")

    st, inv = make_req("/api/admin/inventory?size=5", "GET", token=admin_token)
    print(f"\nGET /api/admin/inventory: {st} -> Total Inventory: {inv.get('totalElements') if isinstance(inv, dict) else inv}")

    st, rev = make_req("/api/admin/reviews?size=5", "GET", token=admin_token)
    print(f"GET /api/admin/reviews: {st} -> Total Reviews: {rev.get('totalElements') if isinstance(rev, dict) else rev}")