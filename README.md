# Club Management API (Node.js | Express | MySQL | JWT | Jest)

Backend REST API for managing users, invitations, and guest access in a club system.

Built with Node.js and Express using clean architecture principles, authentication, and automated testing.
---

## 💡 About the Project

This API simulates a real-world club management system where users can generate invitations and manage guest access.

It supports:
- User authentication
- Invitation generation and validation
- Guest management
- Machine-based invitation synchronization

This project demonstrates clean architecture, business rule implementation, and secure authentication.

---

## 🚀 Tech Stack

**Backend:**
- Node.js
- Express

**Database:**
- MySQL

**Authentication & Security:**
- JWT (jsonwebtoken)
- bcrypt
- dotenv

**Testing:**
- Jest
- Supertest (integration tests)

**File handling:**
- multer

**Documentation:**
- Swagger (OpenAPI 3.0)
---

## 📁 Project Structure

src/
├─ controllers/   # Handle requests and call services  
├─ services/      # Business logic  
├─ middlewares/   # Authentication, validation, and error handling  
├─ routes/        # API endpoints  
├─ repositories/  # Database access  
├─ db/            # Database scripts (schema.sql)  

tests/  
├─ integration/   # API integration tests  

---

## ▶️ Running the Project

Clone the repository:

```bash
git clone https://github.com/paulohenriquecosta3011/Api-Clube.git
cd Api-Clube
npm install
```
Run the API:
```bash
npm start
```


Run the integration tests:
```bash

NODE_ENV=test npx jest --runInBand
```

## 📌 Example Request

### Create User
POST /users/register

```json
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "123456"
}
```

## 📚 API Documentation


Swagger documentation is available locally at:

http://localhost:3001/api-docs

> 🚧 Production URL will be available soon (deployment in progress)

🔗 API Endpoints
Users

## 🔗 API Endpoints

### 👤 Users
- POST /users/register → Create a new user
- POST /users/login → User authentication
- POST /users/generate-code → Generate temporary code
- POST /users/validate-code → Validate temporary code
- POST /users/setPassword → Set user password

---

### 🎟️ Invitations
- POST /convites/register → Register a new invitation
- POST /convites/download → Download invitations
- GET /convites/meus → List user invitations

---

### 👥 Guests
- POST /convidados/registerConvidado → Register a new guest

---

### 🖥️ Machines
- POST /maquinas/novo-token → Create a new machine token

## 🧠 Architecture

This project follows a clean layered architecture designed for scalability and maintainability.

- **Controller** → Handles HTTP requests and responses
- **Service** → Contains business logic and application rules
- **Repository** → Responsible for database access and queries
- **Middlewares** → Handles authentication, validation, and error handling

This separation of concerns improves testability, code organization, and long-term scalability.

🧪 Testing
Integration tests built with Jest and Supertest
Environment isolated using NODE_ENV=test
External dependencies are mocked
📌 Features
RESTful API
JWT Authentication
Centralized error handling
Environment-based configuration
Integration tests
Swagger documentation
🔒 Security
Password hashing with bcrypt
JWT authentication
Environment variables for sensitive data

## 👨‍💻 Notes for Recruiters

Strong background in Delphi-based enterprise systems with 1.5+ years of hands-on experience building Node.js backend APIs.

This project demonstrates:
- Real-world backend architecture
- Authentication and authorization (JWT)
- Integration testing with Jest and Supertest
- External service integration (e.g. email services)
- Production-style API structure

Focused on writing clean, scalable, and maintainable backend systems.

📦 Future Improvements
CI/CD pipeline (GitHub Actions)
Automated deployment
Rate limiting improvements
Logging system (Winston / Pino)
API versioning
🧑‍💻 Author

Developed by Paulo Henrique
Backend Developer (Node.js / Delphi background)
