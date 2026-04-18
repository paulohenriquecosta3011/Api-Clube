// src/tests/integration/convites/downloadConvites.test.js

import supertest from 'supertest';
import app from '../../../app.js';
import db from '../../../db/db.js';
import path from 'path';
import { createAdminUser } from '../../helpers/createAdminUser.js';
import { createStandardUser } from '../../helpers/createStandardUser.js';
import { createGuest } from '../../helpers/createGuest.js';
import { createInvite } from '../../helpers/createInvite.js';
import { createMachine } from '../../helpers/createMachine.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';

const request = supertest(app);

describe('POST /api/v1/invitations/download - integration tests', () => {
  let admin;
  let user;
  let convidadoCpf = '07966282899';

  beforeAll(async () => {
    // Cria usuário admin e usuário padrão via helpers
    admin = await createAdminUser({ email: `admin${Date.now()}@test.com` });
    user = await createStandardUser({ email: `user${Date.now()}@test.com` });

    // Cria convidado via helper
    await createGuest(user.token, convidadoCpf);

    // Cria máquina via helper (retorna token da máquina)
    global.machineToken = await createMachine(admin.token, {
      nome: 'PORTARIA_TEST',
      descricao: 'PC da portaria teste',
    });

    // Cria convite via helper
    global.dataDownload = '2026-03-01';
    const convite = await createInvite(user.token, convidadoCpf, global.dataDownload);
    global.conviteIds = [convite.id_convite];
  });

  it('should download invites successfully', async () => {
    const res = await request
      .post('/api/v1/invitations/download')
      .set('token-maquina', global.machineToken)
      .send({ data: global.dataDownload });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Convites baixados com sucesso/i);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    // Limpeza usando helper
    await cleanupTestData({
      cpf: convidadoCpf,
      userId: user.id,
      adminId: admin.id
    });
    await db.end();
  });
});