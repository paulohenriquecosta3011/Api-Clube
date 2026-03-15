// src/tests/integration/users/users.validation-single.test.js
import db from '../../../db/db.js';
import { createStandardUser } from '../../helpers/createStandardUser.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';
import app from '../../../app.js';
import supertest from 'supertest';
import * as usersService from '../../../services/users.service.js';
import * as verifyTokenModule from '../../../utils/verifyToken.js';
import { afterAll, beforeAll, afterEach, describe, expect, it, jest } from '@jest/globals';

const request = supertest(app); // <-- instância correta, usar depois direto

let standardUser;

beforeAll(async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  standardUser = await createStandardUser({ cleanBeforeInsert: true });
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await cleanupTestData({ userId: standardUser.id });
  await db.end();
});

describe('POST /api/users validation endpoints (mocked + helpers)', () => {
  
  it('should validate code successfully', async () => {
    jest.spyOn(usersService, 'validateCodeService').mockResolvedValue({ valid: true });

    const response = await request
      .post('/api/users/validate-code')
      .set('Authorization', `Bearer ${standardUser.token}`)
      .send({ code: '123456' });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Code validated successfully/i);
    expect(response.body.data.result).toBeDefined();
  });

  it('should return 400 if token is missing', async () => {
    const response = await request
      .post('/api/users/validate-code')
      .send({ code: '123456' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Token and code are required/i);
  });

  it('should set password successfully', async () => {
    jest.spyOn(usersService, 'setPasswordService').mockResolvedValue({ updated: true });
    jest.spyOn(verifyTokenModule, 'verifyToken').mockReturnValue({
      userId: standardUser.id,
      id_empresa: 1
    });

    const response = await request
      .post('/api/users/setPassword')
      .set('Authorization', `Bearer ${standardUser.token}`)
      .send({
        code: '123456',
        password: 'newStrongPassword123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Password set successfully/i);
    expect(response.body.data).toBeDefined();
  });

});