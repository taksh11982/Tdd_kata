# Car Dealership Inventory System

A full-stack inventory management system for car dealerships built with **Spring Boot** and **React**.

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Features

### Authentication & Authorization
- JWT-based authentication with role-based access control
- **ADMIN** — full CRUD operations, restock, delete
- **USER** — browse inventory, purchase vehicles

### Vehicle Management
- Create, update, patch, and delete vehicles
- Search by make, model, category, and price range
- Restock inventory (admin only)
- Purchase vehicles with stock validation

### Dashboard
- Real-time inventory stats (total vehicles, stock levels, out-of-stock, categories)
- Paginated vehicle cards with premium dark UI
- Toast notifications for all operations

### Admin Panel
- Full inventory control with create/edit/restock/delete modals
- Live stat cards (total vehicles, stock, out-of-stock, low stock)
- Paginated grid with CRUD actions per vehicle

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Spring Boot 3.5, Java 21, Spring Security, JPA/Hibernate |
| Database   | MySQL 8+                                |
| Auth       | JWT (jjwt), BCrypt                      |
| API Docs   | Springdoc OpenAPI (Swagger UI)          |
| Frontend   | React 19, Vite, React Router, Axios     |
| Styling    | Tailwind CSS v4, custom dark theme      |

---

## Project Structure

```
TDD Kata/
├── backend/
│   ├── src/main/java/com/study/prep/backend/
│   │   ├── config/          # Security, Swagger, Seeder
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Global exception handling
│   │   ├── repository/      # Spring Data JPA repos
│   │   ├── security/        # JWT filter, token util
│   │   └── service/         # Business logic + impl
│   └── src/test/            # Unit tests (Mockito)
│
├── frontend/
│   └── src/
│       ├── components/      # Navbar, SearchBar, Pagination
│       ├── context/         # AuthContext
│       ├── pages/           # Login, Register, Dashboard, Admin
│       └── services/        # API layer, vehicleService
```

---

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+
- Maven (or use `mvnw`)

### Backend

1. Create the MySQL database:
```sql
CREATE DATABASE incubyte;
```

2. Configure environment variables (or use defaults):
```bash
export DATASOURCE_URL=jdbc:mysql://localhost:3306/incubyte
export DB_USER=root
export DB_PASS=yourpassword
export JWT_SECRET=yourSecretKey
```

3. Run the server:
```bash
cd backend
./mvnw spring-boot:run
```

Server starts at `http://localhost:8080`. Tables are auto-created by JPA (`ddl-auto=create`).

**Admin credentials** are printed to the server console on startup via `AdminSeeder`:
```
Email:    admin@cardealership.com
Password: admin123
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
---

App starts at `http://localhost:5173`

---

## API Documentation (Swagger)

The backend exposes interactive API documentation via **SpringDoc OpenAPI 3.0**.

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

The Swagger UI provides:
- Full request/response schemas for all endpoints
- **JWT Bearer token authentication** — click "Authorize" and paste your token to test protected endpoints
- Auto-generated documentation from DTOs and controller signatures
- Try-it-out functionality for every endpoint

The `OpenApiConfig` class configures the API title, description, version, and the global `Bearer Token` security scheme so authenticated requests work directly from the Swagger UI.

## API Endpoints

### Auth
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| POST   | `/api/auth/register` | Register new user    |
| POST   | `/api/auth/login`    | Login & get JWT      |

### Vehicles
| Method | Endpoint                  | Description              | Auth   |
|--------|---------------------------|--------------------------|--------|
| GET    | `/api/vehicles`           | List vehicles (paginated)| PUBLIC |
| GET    | `/api/vehicles/stats`     | Inventory statistics     | USER   |
| GET    | `/api/vehicles/search`    | Search vehicles          | USER   |
| POST   | `/api/vehicles`           | Create vehicle           | ADMIN  |
| PATCH  | `/api/vehicles/{id}`      | Partial update           | ADMIN  |
| PUT    | `/api/vehicles/{id}`      | Full update              | ADMIN  |
| DELETE | `/api/vehicles/{id}`      | Delete vehicle           | ADMIN  |
| PUT    | `/api/vehicles/{id}/purchase` | Purchase (decreases qty) | USER |
| PUT    | `/api/vehicles/{id}/restock`  | Restock (increases qty)  | ADMIN |

---

## Development Approach — Test-Driven Development (TDD)

This project was built following **Test-Driven Development (TDD)** practices:

1. **Red** — Write a failing test that defines the desired behavior
2. **Green** — Write the minimum code necessary to make the test pass
3. **Refactor** — Clean up the implementation while keeping all tests green

Tests were written **before** the corresponding feature code. The backend service layer (`VehicleServiceImplTest`) has comprehensive unit tests using **JUnit 5** and **Mockito**, covering:

- Vehicle CRUD operations (create, read, update, delete)
- Purchase flow and stock validation
- Out-of-stock handling
- Resource not found scenarios
- Input validation and error responses

This ensured that business logic was validated at every step before integration.

---

## Deployment

> **Note:** This project is **not deployed** to a live server due to time constraints during the assignment period. It is designed to run locally — see [Getting Started](#getting-started) for setup instructions.

---

## Design Decisions

- **MySQL database** — persistent relational storage with JPA/Hibernate, configured via environment variables (`DATASOURCE_URL`, `DB_USER`, `DB_PASS`) with sensible defaults
- **Stateless JWT auth** — tokens stored in localStorage, no server-side sessions
- **Role in DB stored as `ADMIN`** — `ROLE_` prefix prepended at runtime in `CustomUserDetailsService`
- **Pagination** — backend returns `PagedResponse` with `content`, `page`, `size`, `totalElements`, `totalPages`
- **GlobalExceptionHandler** — consistent error responses across all endpoints

---

## AI Usage

This project was developed with AI assistance as permitted by the assignment.

AI was used for:
- Generating boilerplate code
- DTO and repository scaffolding
- Initial unit test structure
- Documentation assistance

All generated code was reviewed, integrated, modified where necessary, and validated manually.
