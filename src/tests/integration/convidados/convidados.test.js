// src/tests/integration/convidados/convidados.test.js

import app from '../../../../src/app.js';
import supertest from 'supertest';
import db from '../../../../src/db/db.js';
import { createAdminUser } from '../../helpers/createAdminUser.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';
import path from 'path';
import fs from 'fs';

const request = supertest(app);

describe('POST /api/v1/guests - DEBUG mode', () => {

  let adminUser;
  let adminToken;

  const filePath = path.resolve(__dirname, '../../files/test-image.jpg');

  beforeAll(async () => {
    adminUser = await createAdminUser({
      email: `admin${Date.now()}@test.com`
    });

    adminToken = adminUser.token;

    console.log('ADMIN TOKEN:', adminToken);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData({ adminId: adminUser.id });
    await db.end();
  });

  it('debug - should hit route without middleware', async () => {

    process.stdout.write('>>> TEST START\n');
  
    const res = await request
      .post('/api/v1/guests')
      .send({
        nome: 'Test Guest',
        cpf: '12345678901',
        telefone: '999999999'
      });
  
    process.stdout.write('>>> STATUS: ' + res.status + '\n');
    process.stdout.write('>>> BODY: ' + JSON.stringify(res.body) + '\n');
    process.stdout.write('>>> TEST END\n');
  });
});