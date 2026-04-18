import request from 'supertest';
import app from '../../app.js';
import path from 'path';
import db from '../../db/db.js';

/**
 * Cria um convidado para testes
 * @param {string} userToken - Token do usuário que cria o convidado
 * @param {string} cpf - CPF do convidado
 * @param {boolean} cleanBeforeInsert - Se true, remove qualquer convidado com mesmo CPF antes
 * @returns {Promise<{cpf: string}>}
 */
export async function createGuest(userToken, cpf, cleanBeforeInsert = false) {
  if (cleanBeforeInsert) {
    await db.query('DELETE FROM convidados WHERE cpf = ?', [cpf]);
  }

  const filePath = path.join(process.cwd(), 'src/tests/files/test-image.jpg');

  const res = await request(app)
    .post('/api/v1/guests')
    .set('Authorization', `Bearer ${userToken}`)
    .field('nome', 'Guest Test')
    .field('cpf', cpf)
    .attach('foto', filePath);

  if (res.status !== 201) {
    throw new Error(`Failed to create guest: ${JSON.stringify(res.body)}`);
  }

  return { cpf };
}