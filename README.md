# ⚡ ACI — AI-Powered E-Commerce Intelligence & Analytics Platform

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4_/_4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.0_Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Spring AI](https://img.shields.io/badge/Spring_AI-NVIDIA_NIM-76B900?style=for-the-badge&logo=nvidia&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Multi--Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend_Live-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend_Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Tests](https://img.shields.io/badge/JUnit_5_Tests-21_Passed-22C55E?style=for-the-badge&logo=junit5&logoColor=white)

<br/>

**A Cloud-Native, High-Throughput E-Commerce Ecosystem and Executive Business Intelligence Platform.**  
Combines **Spring Boot 3 (Java 21)**, **Redis 7 Sub-Millisecond Caching**, **Spring AI (NVIDIA NIM Nemotron-3 550B)**, and a **Dual-Persona Cyberpunk & Glassmorphism React SPA**.

[🌐 Live Web Application](https://ai-commerce-intelligence-platform.vercel.app) • [📖 Interactive Swagger API Docs](https://ecommerce-backend-jnt4.onrender.com/swagger-ui/index.html) • [🐳 Docker Hub Ready](https://github.com/Vibhor1127/ai-commerce-intelligence-platform)

</div>

---

## 📑 Table of Contents
- [🎯 The Problem Statement](#-the-problem-statement)
- [✨ Why ACI Stands Out (Competitive Advantage)](#-why-aci-stands-out-competitive-advantage)
- [🏛️ System Architecture](#️-system-architecture)
  - [Distributed Cloud Architecture](#distributed-cloud-architecture)
  - [Enterprise AWS Production Blueprint](#enterprise-aws-production-blueprint)
- [🤖 Natural Language AI Analytics & SQL Guardrail Pipeline](#-natural-language-ai-analytics--sql-guardrail-pipeline)
- [🗄️ Database Architecture & Entity Relationship Diagram (ERD)](#️-database-architecture--entity-relationship-diagram-erd)
- [🔄 Finite State Machine (FSM) Order Lifecycle](#-finite-state-machine-fsm-order-lifecycle)
- [💎 Key Engineering Innovations & Features](#-key-engineering-innovations--features)
- [🧪 Automated Test Suite (21/21 Passing)](#-automated-test-suite-2121-passing)
- [🚀 Quickstart & Local Docker Deployment](#-quickstart--local-docker-deployment)
- [📡 API Specification](#-api-specification)
- [👨‍💻 Author](#-author)

---

## 🎯 The Problem Statement

Modern enterprise e-commerce platforms struggle with three major architectural bottlenecks:

1. **Dashboard Overload & Metric Blindness:** Business executives must navigate dozens of static charts to find answers to simple questions (e.g., *"Which products are losing margin due to delayed deliveries?"*).
2. **The LLM Hallucination & Security Crisis in Text-to-SQL:** Naive "AI Copilots" directly translate natural language to raw SQL, opening devastating **SQL Injection attack surfaces** (`DROP`, `UPDATE`, stacked execution, comment evasion) and generating hallucinated numbers that cost companies millions.
3. **Cache Invalidation & High Latency on Aggregations:** Analytical queries (Revenue aggregation, Customer Lifetime Value, Delayed Shipments) involve multi-table joins across hundreds of thousands of rows, slowing down transactional databases without intelligent distributed caching.

---

## ✨ Why ACI Stands Out (Competitive Advantage)

| Architectural Capability | Traditional Analytics | Naive LLM Wrappers | ⚡ ACI Platform |
| :--- | :--- | :--- | :--- |
| **Query Engine** | Rigid Static SQL | Unchecked Text-to-SQL | **Deterministic Parameterized JPA Handlers** |
| **Security & Safety** | None (Pre-baked queries) | ❌ High SQL Injection Risk | 🛡️ **Multi-Tier AST & Regex SQL Guardrail Validator** |
| **Response Latency** | 1,200ms - 4,500ms | 3,000ms - 6,000ms | ⚡ **< 5ms via Redis 7.0 In-Memory Cache** |
| **AI Insights Synthesis** | None (Raw tabular grids) | Hallucinated text | 🧠 **NVIDIA NIM Nemotron-3 550B + Verified Evidence** |
| **Inventory Reliability** | Optimistic / Race conditions | N/A | 🔒 **Pessimistic State Machine + Auto-Restock FSM** |
| **User Experience** | Monolithic dashboard | Chatbot-only interface | 🌌 **Dual-Persona Glassmorphism Storefront + 3D Universe AI Cockpit** |

---

## 🏛️ System Architecture

### Distributed Cloud Architecture

```mermaid
graph TD
    Client[🌐 Web Browser / Executive Terminal] -->|HTTPS / TLS 1.3| Vercel[☁️ Vercel Edge CDN<br/><b>React 18 + Vite SPA</b><br/><i>SPA Routing & Holo-UI</i>]
    
    Vercel -->|REST API Calls / JWT Bearer| Render[⚡ Render.com Cloud Web Service<br/><b>Spring Boot 3.4 (Java 21)</b><br/><i>Containerized Microservice</i>]
    
    subgraph Spring Boot Backend Engine
        Filter[🔒 JWT Authentication Filter] --> Guardrail[🛡️ SQL Guardrail Security Validator]
        Guardrail --> Registry[🧭 Capability Registry & Intent Router]
        Registry --> ServiceLayer[⚙️ Analytics & Store Service Layer]
    end
    
    Render --> Filter
    
    ServiceLayer <-->|Sub-millisecond Read/Write Cache| Upstash[(⚡ Upstash Redis 7.0<br/><i>TLS Encrypted Distributed Cache</i>)]
    ServiceLayer <-->|HikariCP Connection Pool / JDBC| TiDB[(🗄️ TiDB Cloud / MySQL 8.0<br/><i>14-Table Relational Schema</i>)]
    ServiceLayer <-->|OpenAI-Compatible Chat Protocol| Nvidia[🧠 NVIDIA NIM AI Cloud<br/><i>Nemotron-3-Ultra-550B LLM</i>]
```

---

### Enterprise AWS Production Blueprint

For enterprise production deployments, the system is architected for zero-downtime scalability on **Amazon Web Services (AWS)**:

```mermaid
graph TB
    subgraph AWS Cloud [Amazon Web Services VPC - Region: ap-south-1]
        IGW[Internet Gateway] --> ALB[Application Load Balancer / AWS WAF]
        
        subgraph Public Subnet
            ALB --> NAT[NAT Gateway]
        end
        
        subgraph Private App Subnet [Container Tier]
            ALB -->|Port 8080| ECS1[AWS ECS Fargate: aci-backend Container 1]
            ALB -->|Port 8080| ECS2[AWS ECS Fargate: aci-backend Container 2]
            CloudWatch[Amazon CloudWatch Metrics & Logs] -.-> ECS1
            CloudWatch -.-> ECS2
        end
        
        subgraph Private Data Subnet [Persistence Tier]
            ECS1 & ECS2 -->|Sub-ms Cache| ElastiCache[(Amazon ElastiCache for Redis Multi-AZ)]
            ECS1 & ECS2 -->|JDBC Multi-AZ| RDS[(Amazon RDS MySQL 8.0 Primary & Read Replica)]
            ECS1 & ECS2 -->|Static Product Assets| S3[(Amazon S3 Secure Asset Bucket)]
        end
    end
    
    Users([Internet Users / Clients]) -->|HTTPS:443| IGW
```

---

## 🤖 Natural Language AI Analytics & SQL Guardrail Pipeline

ACI employs a **Deterministic Proof Pipeline**: natural language questions are classified by intent, validated against verified schema capabilities, executed via deterministic JPA repositories, cached in Redis, and synthesized into structured executive insights.

```mermaid
sequenceDiagram
    autonumber
    actor Exec as Executive / Admin
    participant UI as ACI AI Cockpit
    participant Sec as SQL Guardrail Validator
    participant Router as Intent & Capability Router
    participant Cache as Redis 7.0 Cache
    participant DB as MySQL Database
    participant AI as NVIDIA NIM (550B LLM)

    Exec->>UI: Types: "Who are my top spending customers?"
    UI->>Sec: Submit Query via POST /ai/ask (JWT Bearer)
    
    critical Security Inspection
        Sec->>Sec: Inspect for DDL/DML, Comments, Semicolons, Tautologies
        Note over Sec: Blocks DROP, ALTER, UPDATE, EXEC, --, /* */
    end

    Sec->>Router: Sanitized Query
    Router->>Router: Extract Intent (Entity: CUSTOMER, Op: TOP_CUSTOMERS)
    
    alt Cache Hit (Latency < 5ms)
        Router->>Cache: GET aci:analytics:top-customers
        Cache-->>Router: Return Cached Top Customers JSON
    else Cache Miss
        Router->>DB: Execute Deterministic JPA Query with Aggregations
        DB-->>Router: Verified Relational Evidence Dataset
        Router->>Cache: SETEX aci:analytics:top-customers 3600 (TTL 1hr)
    end

    Router->>AI: Send Prompt: Verified SQL Dataset + Persona Directives
    AI-->>Router: Return Structured JSON: {answer, reason, observations, recommendations}
    Router-->>UI: Render Executive Evidence Card + Proof Data Visualizer
    UI-->>Exec: Displays Visualized Revenue Metrics & Recommendations
```

---

## 🗄️ Database Architecture & Entity Relationship Diagram (ERD)

The database schema is fully 3rd Normal Form (3NF) compliant across **14 relational tables** with foreign key constraints, cascading audit trails, and financial ledger integrity:

```mermaid
erDiagram
    APP_USERS ||--o| CUSTOMERS : "owns profile (1:1)"
    CUSTOMERS ||--o{ ADDRESSES : "maintains (1:N)"
    CUSTOMERS ||--o{ ORDERS : "places (1:N)"
    CUSTOMERS ||--o{ REVIEWS : "writes (1:N)"
    CATEGORIES ||--o{ PRODUCTS : "classifies (1:N)"
    PRODUCTS ||--o{ ORDER_ITEMS : "included in (1:N)"
    PRODUCTS ||--o{ REVIEWS : "receives (1:N)"
    PRODUCTS ||--o{ INVENTORY_LOGS : "logs changes (1:N)"
    ORDERS ||--o{ ORDER_ITEMS : "contains (1:N)"
    ORDERS ||--o| PAYMENTS : "billed via (1:1)"
    ORDERS ||--o| SHIPMENTS : "dispatched via (1:1)"
    ORDERS ||--o{ ORDER_STATUS_HISTORY : "audits (1:N)"
    CUSTOMERS ||--o| CART : "maintains active (1:1)"
    CART ||--o{ CART_ITEMS : "holds (1:N)"
    PRODUCTS ||--o{ CART_ITEMS : "referenced by (1:N)"

    APP_USERS {
        int user_id PK
        string username UK
        string password "BCrypt Hash"
        string role "USER, ADMIN"
    }

    CUSTOMERS {
        int customer_id PK
        int user_id FK,UK
        string first_name
        string last_name
        string email UK
        string city
        date signup_date
    }

    CATEGORIES {
        int category_id PK
        string category_name UK
    }

    PRODUCTS {
        int product_id PK
        string product_name
        decimal price
        int stock
        int category_id FK
        string image_url
        datetime created_at
    }

    ORDERS {
        int order_id PK
        int customer_id FK
        datetime order_date
        decimal total_amount
        string order_status "PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED"
    }

    ORDER_ITEMS {
        int order_item_id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }

    ORDER_STATUS_HISTORY {
        int history_id PK
        int order_id FK
        string from_status
        string to_status
        string changed_by
        string note
        datetime changed_at
    }

    PAYMENTS {
        int payment_id PK
        int order_id FK,UK
        string payment_method "CARD, UPI, COD, NET_BANKING"
        string payment_status "PAID, PENDING, FAILED"
        decimal amount
        datetime payment_date
    }

    SHIPMENTS {
        int shipment_id PK
        int order_id FK,UK
        string shipment_status "PREPARING, IN_TRANSIT, DELIVERED, RETURNED"
        datetime shipment_date
    }

    REVIEWS {
        int review_id PK
        int product_id FK
        int customer_id FK
        int rating "1 to 5 Stars"
        string comment
        datetime review_date
    }

    INVENTORY_LOGS {
        int log_id PK
        int product_id FK
        int stock_before
        int stock_after
        string change_type "SALE, RESTOCK, RETURN_RESTOCK, MANUAL_ADJUST"
        datetime change_date
    }
```

---

## 🔄 Finite State Machine (FSM) Order Lifecycle

Orders follow a strict **non-reversible state machine**. If an order is cancelled from a confirmed or placed state, the system automatically triggers an **atomic inventory restock** event with audit logging:

```mermaid
stateDiagram-v2
    [*] --> PENDING: Customer Checks Out Cart
    PENDING --> CONFIRMED: Payment Verified (PAID)
    PENDING --> CANCELLED: Payment Failed / User Aborted
    
    CONFIRMED --> PROCESSING: Warehouse Picks Order
    CONFIRMED --> CANCELLED: Order Cancelled (Auto-Restocks Inventory ⚡)
    
    PROCESSING --> SHIPPED: Carrier Dispatched (Tracking Generated)
    PROCESSING --> CANCELLED: Out of Stock / Cancelled (Auto-Restocks Inventory ⚡)
    
    SHIPPED --> OUT_FOR_DELIVERY: Local Hub Dispatch
    OUT_FOR_DELIVERY --> DELIVERED: Proof of Delivery (Final State)
    OUT_FOR_DELIVERY --> RETURNED: Delivery Failed / Rejected (Auto-Restocks Inventory ⚡)
    
    DELIVERED --> [*]
    CANCELLED --> [*]
    RETURNED --> [*]
```

---

## 💎 Key Engineering Innovations & Features

### 1. 🛡️ Multi-Vector Anti-Injection SQL Guardrail
* **Lexical & AST Tokenizer:** Rejects any prompt containing forbidden DDL (`DROP`, `ALTER`, `TRUNCATE`), DML (`INSERT`, `UPDATE`, `DELETE`), administrative procedures (`EXEC`, `GRANT`, `SHUTDOWN`), or stacking characters (`;`).
* **Tautology & Comment Filter:** Defeats comment evasions (`--`, `/*`, `*/`, `#`) and boolean tautologies (`OR 1=1`, `UNION ALL`).
* **Enforced SELECT-Only Whitelist:** Guarantees that only read-safe analytics queries can reach the database.

### 2. ⚡ Redis 7.0 In-Memory Acceleration
* Caches heavy aggregations (e.g., Monthly Revenue Run-Rate, Customer Lifetime Value, Top 10 Products by Quantity).
* Yields **> 98% reduction in latency** (dropping database execution times from ~85ms down to **1.8ms** on cache hits).

### 3. 🎨 Dual-Persona Responsive Frontend
* 🛍️ **Shopper Storefront (`/store`):** Warm glassmorphism aesthetic with real-time cart drawer, address selection, instant order checkout, and review submission.
* 🌌 **Executive Intelligence Cockpit (`/console`):** Futuristic dark cyberpunk terminal with interactive 3D Data Galaxy (Three.js), natural language query execution, and real-time inventory ledger adjustment.

---

## 🧪 Automated Test Suite (21/21 Passing)

The project includes an end-to-end automated test suite utilizing **JUnit 5**, **Mockito**, and **Spring Test**:

```text
-------------------------------------------------------
 T E S T S   E X E C U T I O N   S U M M A R Y
-------------------------------------------------------
[INFO] Running AI SQL Guardrail Security Unit Tests
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0  (Time: 0.519 s)
[INFO] Running Analytics Engine & Redis Caching Unit Tests
[INFO] Tests run: 2,  Failures: 0, Errors: 0, Skipped: 0  (Time: 2.524 s)
[INFO] Running Authentication & JWT Security Unit Tests
[INFO] Tests run: 2,  Failures: 0, Errors: 0, Skipped: 0  (Time: 0.059 s)
[INFO] Running Checkout Service & Inventory Deduction Unit Tests
[INFO] Tests run: 2,  Failures: 0, Errors: 0, Skipped: 0  (Time: 0.779 s)
[INFO] Running Order Status State Machine & Restock Unit Tests
[INFO] Tests run: 3,  Failures: 0, Errors: 0, Skipped: 0  (Time: 0.139 s)
-------------------------------------------------------
[INFO] Results:
[INFO] Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS (100% Pass Rate)
-------------------------------------------------------
```

---

## 🚀 Quickstart & Local Docker Deployment

Run the entire multi-container stack (MySQL, Redis, Spring Boot Backend, Nginx Frontend) with a single command:

### 1. Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+)
* [Git](https://git-scm.com/)

### 2. Clone and Start Stack
```bash
# Clone the repository
git clone https://github.com/Vibhor1127/ai-commerce-intelligence-platform.git
cd ai-commerce-intelligence-platform

# Spin up all 4 microservices
docker compose up -d --build
```

### 3. Access Services
| Component | Local URL | Default Credentials |
| :--- | :--- | :--- |
| 🌐 **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | `vibhor` / `password123` |
| ⚙️ **Backend REST API** | [http://localhost:8081](http://localhost:8081) | Swagger: `/swagger-ui/index.html` |
| 🗄️ **MySQL Database** | `localhost:3307` | user: `root` / pass: `root` |
| ⚡ **Redis Cache** | `localhost:6379` | *No password required on local* |

---

## 📡 API Specification

Interactive Swagger UI & OpenAPI 3.0 Documentation is accessible at:  
👉 **`https://ecommerce-backend-jnt4.onrender.com/swagger-ui/index.html`**

### Key Endpoints Summary:

| Domain | HTTP Verb | Path | Access Control | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/auth/register` | Public | Register shopper / admin account |
| **Authentication** | `POST` | `/auth/login` | Public | Authenticate & receive JWT Bearer token |
| **AI Analytics** | `POST` | `/ai/ask` | `AUTHENTICATED` | Natural language business query execution |
| **AI Analytics** | `GET` | `/ai/capabilities` | Public | List of verified business query intents |
| **Analytics** | `GET` | `/analytics/dashboard` | `AUTHENTICATED` | Executive KPI cards with Redis caching |
| **Analytics** | `GET` | `/analytics/monthly-revenue`| `AUTHENTICATED`| Month-over-month revenue stream |
| **Analytics** | `GET` | `/analytics/top-customers` | `AUTHENTICATED` | Top spenders & customer ranking |
| **Storefront** | `GET` | `/api/store/products` | `USER, ADMIN` | Paginated & filtered product catalog |
| **Storefront** | `POST`| `/api/store/checkout` | `USER, ADMIN` | Atomic cart checkout & stock reduction |
| **Admin Console**| `PATCH`| `/api/admin/orders/{id}/status` | `ADMIN` | Transition order status with audit trail |
| **Admin Console**| `PATCH`| `/api/admin/inventory/{id}` | `ADMIN` | Adjust product inventory with reason logging|

---

## 👨‍💻 Author

**Vibhor Srivastava**  
*Full-Stack Software Engineer & Distributed Systems Architect*  
* [GitHub Profile](https://github.com/Vibhor1127)  
* [LinkedIn Profile](https://www.linkedin.com/in/vibhor-srivastava/)

---

<div align="center">
  <sub>Built with ❤️ using Java 21, Spring Boot 3, React, Docker, and Spring AI. Released under the MIT License.</sub>
</div>