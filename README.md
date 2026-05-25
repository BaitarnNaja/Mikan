# Mikan Marketplace

Mikan Marketplace is a multi-vendor e-commerce platform with AI-powered product search.

## Project Structure

```bash
Mikan-Marketplace/
└── AI/          # Python AI module
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

# AI module
- Python
- RAG

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

# Run AI

Open AI project on your preferred IDE.

1. Create `.env` at `./AI/.env`
2. Copy these text in .env
```
GOOGLE_API_KEY={YOUR_API_KEYS}
CHROMADB_API={YOUR_API_KEYS}
```
**Note** You can get your own API keys at
- Google cloud AI API `https://aistudio.google.com/app/api-keys`
- ChromaDB API `https://www.trychroma.com`

3. Running module step
Run by using global PIP:

```bash
pip install -r requirements.txt
python module.py
```

Or using virtual environments:

```bash
python -m venv .venv
./.venv/Scripts/activate
pip install -r requirements.txt
python module.py
```

AI module will start at:

```bash
http://localhost:3001
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

All of three folders are separated into different folders.

Run both services simultaneously:

```bash
# Terminal 1
cd Frontend
npm run dev

# Terminal 2
cd Backend
run MikanRestApiApplication.java

# Terminal 3
cd AI
uvicorn module:app --host 0.0.0.0 --port 3001 --reload
```

---

# Author

Developed by Mikan Marketplace Team
