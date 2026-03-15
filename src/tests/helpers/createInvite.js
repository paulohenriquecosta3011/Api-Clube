import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';

/**
 * Cria um convite para testes
 * @param {string} userToken - Token do usuário que cria o convite
 * @param {string} cpf - CPF do convidado
 * @param {boolean} cleanBeforeInsert - Se true, remove qualquer convite existente para o mesmo CPF
 * @returns {Promise<Object>} - Retorna o body da resposta
 */
export async function createInvite(userToken, cpf, cleanBeforeInsert = false) {
  const dataConvite = new Date().toISOString().split('T')[0];

  if (cleanBeforeInsert) {
    await db.query('DELETE FROM convites WHERE cpf_convidado = ?', [cpf]);
  }

  const res = await request(app)
    .post('/api/convites/register')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      cpf_convidado: cpf,
      dataconvite: dataConvite
    });

  if (res.status !== 201) {
    throw new Error(`Failed to create invite: ${JSON.stringify(res.body)}`);
  }

  return res.body;
}