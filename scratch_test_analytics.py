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

# Let's test calling /analytics/dashboard to see what it returns
req = urllib.request.Request(f"{BASE_URL}/analytics/dashboard", headers={"Authorization": f"Bearer {token}"})
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        print(f"/analytics/dashboard -> 200: {r.read().decode('utf-8')[:300]}")
except urllib.error.HTTPError as e:
    print(f"/analytics/dashboard -> {e.code}: {e.read().decode('utf-8')}")

# Let's test /analytics/orders/recent
req = urllib.request.Request(f"{BASE_URL}/analytics/orders/recent?limit=5", headers={"Authorization": f"Bearer {token}"})
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        print(f"/analytics/orders/recent -> 200: {r.read().decode('utf-8')[:300]}")
except urllib.error.HTTPError as e:
    print(f"/analytics/orders/recent -> {e.code}: {e.read().decode('utf-8')}")