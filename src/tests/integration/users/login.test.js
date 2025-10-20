//login.test.js
import request from 'supertest';
import app from '../../../app.js';
import db from '../../../db/db.js';  // seu pool mysql2/promise
import bcrypt from 'bcrypt';

const testUserEmail = 'teste@teste.com';
const testUserEmailIncorreto = 'testeIncorreto@teste.com';

const testUserPassword = 'senha123';
const testUserName = 'usuarioteste';
const testTipoUser = 'S';

beforeAll(async () => {
  const passwordHash = await bcrypt.hash(testUserPassword, 10);

  await db.query(
    'INSERT INTO users (name, tipo_user, email, password) VALUES (?, ?, ?, ?)',
    [testUserName, testTipoUser, testUserEmail, passwordHash]
  );
});

afterAll(async () => {
  await db.query('DELETE FROM users WHERE email = ?', [testUserEmail]);
  await db.end(); // <- fecha o pool de conexões  
});

describe('POST /api/users/login', () => {
  it('deve fazer login com usuário existente', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testUserEmail, password: testUserPassword });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Login successful!');
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toMatchObject({
      email: testUserEmail,
      name: testUserName,
      tipo_user: testTipoUser,
    });
  });

  it('deve retornar 400 se email não for fornecido', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ password: testUserPassword }); // sem email
  
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });


  it('deve retornar 400 se a senha não for fornecida', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testUserEmail });
  
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/password/i);
  });


  it('deve retornar 401 se o email não existir', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUserEmailIncorreto,
        password: 'senhaqualquer'
      });
  
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/usuário.*não encontrado/i); // ou sua mensagem real
  });

  it('deve retornar 401 se a senha estiver incorreta', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUserEmail,
        password: 'senhaErrada123'  // senha incorreta propositalmente
      });
  
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/senha inválida/i); // ou parte da sua mensagem de erro exata
  });  

  it('deve retornar 400 se o email estiver em formato inválido', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'emailinvalido.com',  // sem '@', formato inválido
        password: testUserPassword
      });
  
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/email.*inválido|formato.*inválido/i);
  });

  it('deve retornar 429 se muitas tentativas de login forem feitas em pouco tempo', async () => {
    const maxAttempts = 5;
  
    for (let i = 0; i < maxAttempts; i++) {
      await request(app)
        .post('/api/users/login')
        .send({
          email: testUserEmail,
          password: 'senhaErrada' // senha errada para gerar falha
        });
    }
  
    // A próxima tentativa deve retornar 429
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUserEmail,
        password: 'senhaErrada'
      });
  
    expect(res.status).toBe(429);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/muitas tentativas/i);
  });
  


});
