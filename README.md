# Club Management API

Production-ready REST API for managing users, invitations, and guest access in a club environment.

Built with Node.js and Express, following a clean layered architecture (Controller → Service → Middleware → Repository).

This API simulates a real-world business scenario and can be consumed by any client application or frontend.

---

## 💡 About the Project

This API is a backend system designed to simulate a real-world club management scenario, where users can generate invitations and register guests.

It supports:
- User authentication
- Invitation generation and validation
- Guest management
- Machine-based invitation synchronization

This project demonstrates clean architecture, business rule implementation, and secure authentication.

---

## 🚀 Technologies

- Node.js
- Express
- MySQL
- Jest + Supertest (Integration Tests)
- dotenv
- bcrypt
- jsonwebtoken
- multer
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

POST /users/register → Create a new user
POST /users/login → User login
POST /users/generate-code → Generate a temporary code
POST /users/validate-code → Validate a temporary code
POST /users/setPassword → Set a new password

Invitations

POST /convites/register → Register a new invitation
POST /convites/download → Download invitations
GET /convites/meus → List user invitations

Guests

POST /convidados/registerConvidado → Register a new guest

Machines

POST /maquinas/novo-token → Create a new machine token

🧠 Architecture

This project follows a clean layered architecture:

Controller → Handles HTTP requests and responses
Service → Business logic and rules
Repository → Database access and queries

This separation improves maintainability, scalability, and testability.

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
👨‍💻 Notes for Recruiters
15+ years of experience building business systems (Delphi)
Currently transitioning to Node.js backend development
Strong experience with real-world business rules
Focus on clean architecture and scalability
📦 Future Improvements
CI/CD pipeline (GitHub Actions)
Automated deployment
Rate limiting improvements
Logging system (Winston / Pino)
API versioning
🧑‍💻 Author

Developed by Paulo Henrique
Backend Developer (Node.js / Delphi background)
