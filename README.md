ClubeUva API

API for managing users, invitations, and guests.
Developed in Node.js with Express, following a layered architecture (Controller → Service → Middleware → Repository/Model).
This API can be consumed by any client application.

Technologies

Node.js / Express

MySQL

Jest + Supertest (Integration Tests)

dotenv, bcrypt, jsonwebtoken, multer

Swagger (OpenAPI 3.0)

Project Structure
src/
├─ controllers/   # Handle requests and call services
├─ services/      # Business logic
├─ middlewares/   # Authentication, validation, and error handling
├─ routes/        # API endpoints
├─ models/        # Database access
├─ db/            # Database scripts (schema.sql)
tests/
├─ integration/   # API integration tests
Running the Project

Clone the repository:

git clone <URL_OF_REPO>
cd Apis
npm install

Run the API:

npm start

Run tests:

NODE_ENV=test npx jest --runInBand

Swagger docs available at:
http://localhost:3001/api-docs

API Endpoints
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
Notes for Developers / Recruiters

Clean layered architecture: Controller → Service → Repository

Centralized error handling middleware

Separation of responsibilities for easier maintenance

Two database environments: dev/prod and test

Fully tested API with Jest + Supertest integration tests

Swagger documentation for all endpoints