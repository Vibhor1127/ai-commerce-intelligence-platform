import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "https://ecommerce-backend-jnt4.onrender.com"

# Login as vibhor_admin
req = urllib.request.Request(f"{BASE_URL}/auth/login", data=json.dumps({"username": "vibhor_admin", "password": "password123"}).encode("utf-8"), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, context=ctx) as r:
    token = json.loads(r.read().decode("utf-8"))["token"]

for path in ["/api/admin/orders", "/api/store/orders", "/api/admin/reviews"]:
    req = urllib.request.Request(f"{BASE_URL}{path}", headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, context=ctx) as r:
            print(f"{path} -> 200: {r.read().decode('utf-8')[:100]}")
    except urllib.error.HTTPError as e:
        print(f"{path} -> {e.code}: {e.read().decode('utf-8')}")