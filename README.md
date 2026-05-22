# Mikan Marketplace

Mikan Marketplace is a multi-vendor e-commerce platform with AI-powered product search.

## Project Structure

```bash
Mikan-Marketplace/
├── Backend/     # Spring Boot Backend API
└── Frontend/    # Next.js Frontend
```

---

# Tech Stack

## Frontend
- Next.js
- React
- Material UI (MUI)

## Backend
- Spring Boot
- Java
- PostgreSQL
- Vector Database

---

# Getting Started

# Run Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend will start at:

```bash
http://localhost:3000
```

---

# Backend Configuration

Before running Backend, configure database connection in:

```bash
Backend/src/main/resources/application.properties
```

Add:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.datasource.driver-class-name=
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mikan
spring.datasource.username=postgres
spring.datasource.password=1234
spring.datasource.driver-class-name=org.postgresql.Driver
```

---

# Run Backend

Open backend project in IntelliJ IDEA or your preferred IDE.

Run:

```bash
MikanRestApiApplication.java
```

Or using terminal:

```bash
cd Backend
./mvnw spring-boot:run
```

Backend will start at:

```bash
http://localhost:8080
```

---

# Features

- Multi-vendor marketplace
- AI semantic product search
- Vector search integration
- Shopping cart system
- Order management
- Product recommendation
- Product option support

---

# Development Notes

Frontend and Backend are separated into different folders.

Run both services simultaneously:

```bash
# Terminal 1
cd Frontend
npm run dev

# Terminal 2
cd Backend
run MikanRestApiApplication.java
```

---

# Author

Developed by Mikan Marketplace Team
