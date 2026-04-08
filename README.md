# SmartCity E-Commerce

A full-stack e-commerce application with role-based access (Admin, Seller, Customer).

**Stack:** Spring Boot 3.5 (Java 21) · React 18 · Tailwind CSS · H2 Database · JWT Auth

---

## Running Locally

### Requirements
- [Java 21](https://adoptium.net/temurin/releases/?version=21)
- [Node.js LTS](https://nodejs.org)

### Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
Runs on **http://localhost:8080**

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173**

---

## Running with Docker

### Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Start
```bash
docker-compose up --build
```

### Stop
```bash
docker-compose down
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |
| H2 Console | http://localhost:8080/h2-console |
| Swagger UI | http://localhost:8080/swagger-ui.html |

---

## Project Structure

```
├── backend/         # Spring Boot API
├── frontend/        # React + Vite app
└── docker-compose.yml
```

---

## H2 Database Console

URL: `http://localhost:8080/h2-console`  
JDBC URL: `jdbc:h2:file:./data/smartcity_ecommerce`  
Username: `sa` · Password: *(empty)*

---

## Environment Variables (Docker)

| Variable | Default |
|---|---|
| `SPRING_DATASOURCE_URL` | H2 file-based DB |
| `JWT_SECRET` | Set in docker-compose.yml |
| `FILE_UPLOAD_DIR` | `./uploads` |
