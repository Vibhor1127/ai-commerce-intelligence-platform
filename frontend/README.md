# ACI OS — AI Commerce Intelligence

Frontend for the Spring Boot + Spring AI commerce analytics platform.

## Stack

React 18 · Vite · TypeScript · Tailwind · Framer Motion · React Three Fiber · Recharts · TanStack Query

## Develop

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/auth`, `/ai`, `/analytics` and `/api` to `http://127.0.0.1:8080`.

## Auth

1. `POST /auth/login` → JWT
2. Token stored in `localStorage`
3. Sent as `Authorization: Bearer <token>`
4. `/ai/ask` and `/analytics/**` are protected

## Replica signal

If `/ai/health` is unreachable (no MySQL / Redis / NVIDIA key in this environment), the client switches to a **replica signal**. The replica speaks the same contracts as the backend so the product can be operated and reviewed. A live Spring Boot instance is preferred whenever it is available.

## Routes

| Path | Surface |
| --- | --- |
| `/login` | Clearance gate |
| `/` | Executive command dashboard |
| `/ask` | AI analytics command center |
| `/capabilities` | Dynamic capability mesh from `GET /ai/capabilities` |
