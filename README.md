# AI Commerce Intelligence Platform

Spring Boot analytics engine + ACI OS frontend.

## Backend

`ecommerce-analytics` — Spring Boot 4, MySQL, Redis, Spring AI (NVIDIA NIM), JWT.

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/auth/register` | public |
| POST | `/auth/login` | public |
| GET | `/ai/health` | public |
| GET | `/ai/capabilities` | public |
| POST | `/ai/ask` | JWT |
| GET | `/analytics/**` | JWT |

## Frontend

`frontend` — React + Vite + TypeScript. See [frontend/README.md](frontend/README.md).

```bash
cd frontend
npm install
npm run dev
```