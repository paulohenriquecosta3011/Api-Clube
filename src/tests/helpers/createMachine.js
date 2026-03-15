// src/tests/helpers/createMachine.js
import request from 'supertest';
import app from '../../app.js';

export async function createMachine(adminToken, { nome, descricao }) {
  const res = await request(app)
    .post('/api/maquinas/novo-token')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ nome, descricao });

  if (res.status !== 201) {
    throw new Error(`Failed to create machine: ${res.body.message || res.status}`);
  }

  return res.body.data.token_maquina;
}