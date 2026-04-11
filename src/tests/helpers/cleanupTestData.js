import db from '../../db/db.js';

export async function cleanupTestData({ cpf, userId, adminId } = {}) {

  
  await db.query('DELETE FROM convites_downloads');

  
  await db.query('DELETE FROM convites');

  if (cpf) {
    await db.query('DELETE FROM convidados WHERE cpf = ?', [cpf]);
  }

  
  if (userId || adminId) {

    const ids = [];
    const params = [];

    if (userId) {
      ids.push('?');
      params.push(userId);
    }

    if (adminId) {
      ids.push('?');
      params.push(adminId);
    }

    await db.query(
      `DELETE FROM users WHERE id_user IN (${ids.join(',')})`,
      params
    );
  }
}