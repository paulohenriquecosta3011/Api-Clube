import request from 'supertest';
import app from '../../../app.js';
import db from '../../../db/db.js';
import { createAdminUser } from '../../helpers/createAdminUser.js';
import { createStandardUser } from '../../helpers/createStandardUser.js';
import { createGuest } from '../../helpers/createGuest.js';
import { cleanupTestData } from '../../helpers/cleanupTestData.js';

const convidadoCpf = '07966282899';
const requestApp = request(app);

describe('POST /api/v1/invitations', () => {
  let admin, user;

  beforeAll(async () => {
    admin = await createAdminUser();
    user = await createStandardUser();
    await createGuest(user.token, convidadoCpf);
  });

  afterAll(async () => {
    await cleanupTestData({
      adminId: admin.id,
      userId: user.id,
      cpf: convidadoCpf
    });
    await db.end();
  });

  it('should register a new invite successfully', async () => {
    const res = await requestApp
      .post('/api/v1/invitations')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        cpf_convidado: convidadoCpf,
        dataconvite: '2026-03-01'
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Invite registered successfully/i);
    expect(res.body.data).toHaveProperty('id_convite');
    expect(res.body.data.cpf_convidado).toBe(convidadoCpf);
  });

  it('should return 401 if authentication token is missing', async () => {
    const res = await requestApp
      .post('/api/v1/invitations')
      .send({
        cpf_convidado: convidadoCpf,
        dataconvite: '2026-03-01'
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Token not provided/i);
  });

  it('should return 404 if guest does not exist', async () => {
    const res = await requestApp
      .post('/api/v1/invitations')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        cpf_convidado: '99999999999',
        dataconvite: '2026-03-01'
      });

    expect(res.status).toBe(404);
  });

  it('should return 409 if invite for same CPF and date exists', async () => {
    await requestApp.post('/api/v1/invitations')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ cpf_convidado: convidadoCpf, dataconvite: '2026-03-01' });

    const res = await requestApp.post('/api/v1/invitations')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ cpf_convidado: convidadoCpf, dataconvite: '2026-03-01' });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });
});