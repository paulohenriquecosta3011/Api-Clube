// src/tests/integration/convites/meusconvites.test.js

import request from 'supertest';
import app from '../../../app.js';
import db from '../../../db/db.js';

import { createAdminUser } from '../../helpers/createAdminUser.js';
import { createStandardUser } from '../../helpers/createStandardUser.js';
import { createGuest } from '../../helpers/createGuest.js';
import { createInvite } from '../../helpers/createInvite.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';

describe('GET /api/convites/meus', () => {

  let admin;
  let user;

  const convidadoCpf = '07966282899';

  beforeAll(async () => {
    admin = await createAdminUser();
    user = await createStandardUser();
  });

  it('should create guest', async () => {

    await createGuest(user.token, convidadoCpf);

    const [rows] = await db.query(
      'SELECT * FROM convidados WHERE cpf = ?',
      [convidadoCpf]
    );

    expect(rows.length).toBeGreaterThan(0);

  });

  it('should create invite', async () => {

    await createInvite(user.token, convidadoCpf);

    const [rows] = await db.query(
      'SELECT * FROM convites WHERE cpf_convidado = ?',
      [convidadoCpf]
    );

    expect(rows.length).toBeGreaterThan(0);

  });

  it('should return the logged user invites', async () => {

    const res = await request(app)
      .get('/api/convites/meus')
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

  });

  afterAll(async () => {

    await cleanupTestData({
      cpf: convidadoCpf,
      userId: user.id,
      adminId: admin.id
    });

    await db.end();

  });

});