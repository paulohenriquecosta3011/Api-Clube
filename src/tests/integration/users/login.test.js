// src/tests/integration/users/login.test.js
import { createAdminUser } from '../../helpers/createAdminUser.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';
import app from '../../../app.js';
import supertest from 'supertest';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import db from '../../../db/db.js'; // Para fechar a conexão

const request = supertest(app);

let adminUser;

beforeAll(async () => {
  // Cria o admin usando o helper com email fixo
  adminUser = await createAdminUser({ email: 'admin@example.com' });
});

afterAll(async () => {
  // Limpa os dados de teste
  await cleanupTestData({ adminId: adminUser.id });
  // Fecha a conexão com o banco para Jest não reclamar de detectOpenHandles
  await db.end();
});

describe('POST /api/users/login', () => {

  it('should login admin successfully and return a JWT token', async () => {
    const response = await request.post('/api/users/login').send({
      email: adminUser.email,
      password: 'admin123',
      id_empresa: 1
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.email).toBe(adminUser.email);
    expect(response.body.data.user.tipo_user).toBe('A');
  });

  it('should not login with incorrect password', async () => {
    const response = await request.post('/api/users/login').send({
      email: adminUser.email,
      password: 'wrongpassword',
      id_empresa: 1
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Invalid password/i);
  });

  it('should not login with a non-existent email', async () => {
    const response = await request.post('/api/users/login').send({
      email: 'nonexistent@example.com',
      password: 'anyPassword123',
      id_empresa: 1
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/User not found/i);
  });

});