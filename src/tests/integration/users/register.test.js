// src/tests/integration/users/register-single.test.js
import db from '../../../db/db.js';
import { createAdminUser } from '../../helpers/createAdminUser.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';
import { createStandardUser } from '../../helpers/createStandardUser.js';
import app from '../../../app.js';
import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

const request = supertest(app);

let adminUser;
let adminToken;

beforeAll(async () => {
  // Cria admin com cleanup automático para evitar duplicados
  adminUser = await createAdminUser({ email: 'admin@example.com', cleanBeforeInsert: true });
  adminToken = adminUser.token;
});

afterAll(async () => {
  // Limpa todos os usuários criados durante os testes
  await cleanupTestData({
    adminId: adminUser.id
  });
  await db.end();
});

describe('POST /api/users/register - single test', () => {
  it('should allow admin to register a new standard user', async () => {
    // Limpa usuário com mesmo email antes do teste
    await db.query('DELETE FROM users WHERE email = ?', ['newuser@example.com']);

    const response = await request
      .post('/api/users/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        tipo_user: 'S', // Usuário padrão
        id_base: 1,
        id_empresa: 1
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.data.user.email).toBe('newuser@example.com');

    // Limpa usuário criado no teste
    await cleanupTestData({ userId: response.body.data.user.id });
  });

  it('should not allow registration without an authentication token', async () => {
    const response = await request
      .post('/api/users/register')
      .send({
        name: 'No Token User',
        email: 'notoken@example.com',
        password: 'password123',
        tipo_user: 'S',
        id_base: 1,
        id_empresa: 1
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/Token not provided/i);
  });

  it('should not allow a standard user to register another user', async () => {
    // Cria usuário padrão
    const standardUser = await createStandardUser({ email: 'standard@example.com', cleanBeforeInsert: true });
  
    const response = await request
      .post('/api/users/register')
      .set('Authorization', `Bearer ${standardUser.token}`)
      .send({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123',
        tipo_user: 'S',
        id_base: 1,
        id_empresa: 1
      });
  
    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/Access denied/i);
  
    // Limpa usuários criados
    await cleanupTestData({ userId: standardUser.id });
  }); 
  it('should not allow registration with invalid user type', async () => {
    const response = await request
      .post('/api/users/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Invalid User',
        email: 'invalidtype@example.com',
        password: 'password123',
        tipo_user: 'X', // Inválido
        id_base: 1,
        id_empresa: 1
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Invalid user type/i);
  });

  it('should not allow registration with an existing email', async () => {
    // Cria usuário com email existente
    const existingUser = await createStandardUser({ email: 'existing@example.com', cleanBeforeInsert: true });
  
    const response = await request
      .post('/api/users/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Duplicate Email',
        email: 'existing@example.com',
        password: 'password123',
        tipo_user: 'S',
        id_base: 1,
        id_empresa: 1
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Email already in use/i);
  
    // Limpa usuário existente
    await cleanupTestData({ userId: existingUser.id });
  });

});
