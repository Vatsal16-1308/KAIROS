# Kairos Event Planner — Deployment & Production Guide

This guide describes how to run and deploy the Kairos Event Planner application in production and development environments.

---

## Stack Overview
- **Frontend**: React 19 + Vite 8 + JavaScript + Tailwind / Vanilla CSS
- **Backend**: Java 17 + Spring Boot 3.3.5 + Spring Security (JWT) + Spring Data JPA
- **Containerization**: Multi-stage Alpine Dockerfile (Render / Cloud Ready)
- **Database**: MySQL 8.0+ (Production) / H2 In-Memory (Development/Demo)

---

## 🚀 Deployment Options
1. **Render Cloud Deployment (Docker)**: See [RENDER_DEPLOYMENT.md](file:///c:/Kairos-Event%20Planner/RENDER_DEPLOYMENT.md) for full step-by-step instructions and `render.yaml` blueprint.
2. **Standard JAR Launch**: Detailed below.

---

## 1. Quick Local Start (Development / Demo Mode with H2)

No MySQL installation required. Uses embedded H2 database pre-seeded with sample data.

### Backend:
```bash
cd server
.\mvnw.cmd clean package -DskipTests
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
java -jar target/kairos-backend-1.0.0.jar --spring.profiles.active=h2
```

### Frontend:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 2. Production Deployment with MySQL

### Environment Variables Matrix

| Environment Variable | Description | Example / Required Format |
|---|---|---|
| `SPRING_DATASOURCE_URL` | MySQL Connection String | `jdbc:mysql://localhost:3306/kairos_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | MySQL Username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | MySQL Password | `1308@Vatsal` |
| `JWT_SECRET` | 256-bit Hex Key for JWT | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION_MS` | Token Expiry in Ms | `86400000` (24 Hours) |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS Origins | `http://localhost:5173,https://yourdomain.com` |
| `VITE_API_URL` | Frontend API Base URL | `http://localhost:8080/api` |

### Step-by-Step Production Launch:

1. **Build Frontend Bundle**:
   ```bash
   cd client
   npm run build
   ```
   *Static assets will be output to `client/dist`.*

2. **Package Backend JAR**:
   ```bash
   cd server
   .\mvnw.cmd clean package -DskipTests
   ```

3. **Launch Backend Executable**:
   ```powershell
   $env:SPRING_DATASOURCE_USERNAME = "root"
   $env:SPRING_DATASOURCE_PASSWORD = "your_mysql_password"
   $env:JWT_SECRET = "your_secure_random_64_character_hex_secret_key"
   $env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,https://your-domain.com"
   
   java -jar target/kairos-backend-1.0.0.jar
   ```

---

## 3. Verified Seed Accounts

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@kairos.com` | `admin123` | Full System & User Management |
| **Organizer** | `ieee@kairos.com` | `organizer123` | Create Events & View Attendee Lists |
| **Attendee** | `student@kairos.com` | `student123` | Book Tickets, View Passes, Cancel Bookings |

---

## 4. Verification Checklist & Health Check

- **Health Endpoint**: `GET http://localhost:8080/api/health`
- **Swagger / OpenAPI**: Embedded controllers respond under `/api` context path.
- **Frontend SPA**: All routes handle clean browser reload and client-side routing.
