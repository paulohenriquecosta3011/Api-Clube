# ClubeUva API

API for managing users, invitations, and guests.  
Developed in Node.js with Express, following a layered architecture (Controller → Service → Middleware → Repository).  
This API can be consumed by any client application or frontend.

---

## 🚀 Technologies

- Node.js / Express  
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
├─ controllers/ # Handle requests and call services
├─ services/ # Business logic
├─ middlewares/ # Authentication, validation, and error handling
├─ routes/ # API endpoints
├─ repositories/ # Database access
├─ db/ # Database scripts (schema.sql)

tests/
├─ integration/ # API integration tests


---

## ▶️ Running the Project

Clone the repository:

```bash id="runfull1"
git clone https://github.com/paulohenriquecosta3011/Api-Clube.git
cd Api-Clube
npm install

Run the API:

npm start

Run the integration tests:

NODE_ENV=test npx jest --runInBand
📚 API Documentation

Swagger documentation is available at:

http://localhost:3001/api-docs
🔗 API Endpoints
Users
Method	Endpoint	Description
POST	/users/register	Create a new user
POST	/users/login	User login
POST	/users/generate-code	Generate a temporary code
POST	/users/validate-code	Validate a temporary code
POST	/users/setPassword	Set a new password
Convites
Method	Endpoint	Description
POST	/convites/register	Register a new invitation (user)
POST	/convites/download	Download invitations (machine)
GET	/convites/meus	List my invitations (user)
Convidados
Method	Endpoint	Description
POST	/convidados/registerConvidado	Register a new guest
Maquinas
Method	Endpoint	Description
POST	/maquinas/novo-token	Create a new machine token
🧠 Architecture

This project follows a clean layered architecture:

Controller → Handles HTTP requests and responses
Service → Business logic and rules
Repository → Database access and queries

This separation improves maintainability, scalability, and testability.

🧪 Testing
Integration tests built with Jest and Supertest
Environment isolated using NODE_ENV=test
External dependencies are mocked (e.g., email sending)
📌 Features
RESTful API
JWT Authentication
Centralized error handling
Environment-based configuration
Integration tests
Swagger documentation
Email sending controlled via environment variable (SEND_EMAIL)
🔒 Security
Password hashing with bcrypt
JWT authentication
Environment variables for sensitive data
Email sending controlled to avoid side effects
👨‍💻 Notes for Recruiters
Clean and scalable architecture
Well-defined separation of concerns
Fully tested API with integration tests
Environment-based configuration
Ready for production deployment
Swagger documentation available
Email sending controlled to avoid side effects during testing
📦 Future Improvements
CI/CD pipeline (GitHub Actions)
Automated deployment
Rate limiting improvements
Logging system (Winston / Pino)
API versioning
🧑‍💻 Author

Developed by Paulo Henrique
Backend Developer (Node.js / Delphi background)