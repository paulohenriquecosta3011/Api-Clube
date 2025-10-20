import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';  // seu pool mysql2/promise
import bcrypt from 'bcrypt';

const testUserEmail = 'teste@teste.com';
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

});
