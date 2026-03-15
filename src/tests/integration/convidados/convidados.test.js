// src/tests/integration/convidados/convidados.test.js
import app from '../../../../src/app.js';
import supertest from 'supertest';
import path from 'path';
import fs from 'fs';
import db from '../../../../src/db/db.js';
import { createAdminUser } from '../../helpers/createAdminUser.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';

const request = supertest(app);

describe('POST /api/convidados/registerConvidado - integration tests', () => {
  let adminUser;
  let adminToken;
  let convidadoCpf;

  beforeAll(async () => {
    // Cria usuário admin com helper
    adminUser = await createAdminUser({ email: `admin${Date.now()}@test.com` });
    adminToken = adminUser.token;
  });

  afterAll(async () => {
    // Limpa usuários e convidados criados nos testes
    if (convidadoCpf) {
      await db.query('DELETE FROM convidados WHERE cpf = ?', [convidadoCpf]);
    }
    await cleanupTestData({ adminId: adminUser.id });
    await db.end();
  });

  it('should register a new guest successfully', async () => {
    convidadoCpf = '07966282899';
    const filePath = path.join(__dirname, '../../files/test-image.jpg');

    const res = await request
      .post('/api/convidados/registerConvidado')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nome', 'Test Guest')
      .field('cpf', convidadoCpf)
      .attach('foto', filePath);

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/successfully registered/i);

    expect(res.body.data.convidado).toHaveProperty('foto');
    const fotoSalva = res.body.data.convidado.foto;
    expect(typeof fotoSalva).toBe('string');
    expect(fotoSalva).toMatch(/\.(jpg|jpeg|png)$/i);

    const savedPath = path.join('src/uploads', fotoSalva);
    const exists = fs.existsSync(savedPath);
    expect(exists).toBe(true);
  });

  it('should return 401 if authentication token is missing', async () => {
    const filePath = path.join(__dirname, '../../files/test-image.jpg');

    const res = await request
      .post('/api/convidados/registerConvidado')
      .field('nome', 'Guest Without Token')
      .field('cpf', '12345678901')
      .attach('foto', filePath);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Token not provided/i);
  });

  it('should return 400 if name is missing', async () => {
    const filePath = path.join(__dirname, '../../files/test-image.jpg');

    const res = await request
      .post('/api/convidados/registerConvidado')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('cpf', '98765432102')
      .attach('foto', filePath);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/The following fields are required: nome/i);
  });

  it('should return 400 if CPF is invalid', async () => {
    const invalidCpf = '12345678900';
    const filePath = path.join(__dirname, '../../files/test-image.jpg');

    const res = await request
      .post('/api/convidados/registerConvidado')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nome', 'Guest Invalid CPF')
      .field('cpf', invalidCpf)
      .attach('foto', filePath);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid cpf/i);
  });
  
  it('should return 409 if CPF is already registered', async () => {
    const duplicateCpf = convidadoCpf; // Usa o convidado criado no teste de sucesso
    const filePath = path.join(__dirname, '../../files/test-image.jpg');

    const res = await request
      .post('/api/convidados/registerConvidado')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nome', 'Duplicate Guest')
      .field('cpf', duplicateCpf)
      .attach('foto', filePath);

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/Guest with this CPF already exists./i);
  });  

  it('should return 400 if image is not provided', async () => {
    const res = await request
      .post('/api/convidados/registerConvidado')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nome', 'No Photo Guest')
      .field('cpf', '07966282899');

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/image is required/i);
  });

});