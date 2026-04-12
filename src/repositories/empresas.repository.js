import pool from '../db/db.js';
import { AppError } from '../utils/AppError.js';

export async function findEmpresaById(id_empresa) {
  const [rows] = await pool.execute(
    `SELECT * FROM empresas WHERE id_empresa = ?`,
    [id_empresa]
  );

  return rows[0];
}

export async function controlarLimiteEmail(id_empresa) {

  // 🔄 RESET AUTOMÁTICO (feito direto no MySQL - resolve problema de data/hora)
  await pool.execute(
    `UPDATE empresas
     SET emails_enviados_hoje = 0,
         data_ultimo_envio = CURDATE()
     WHERE id_empresa = ?
       AND (data_ultimo_envio IS NULL OR DATE(data_ultimo_envio) < CURDATE())`,
    [id_empresa]
  );

  // 🔎 Busca dados atualizados
  const [rows] = await pool.execute(
    `SELECT emails_enviados_hoje, data_ultimo_envio, limite_emails_dia
     FROM empresas 
     WHERE id_empresa = ?`,
    [id_empresa]
  );

  const empresa = rows[0];

  const emailsHoje = empresa.emails_enviados_hoje ?? 0;

  // 🎯 Limite dinâmico por empresa
  const LIMITE = empresa.limite_emails_dia ?? 50;

  // 🚫 Validação
  if (emailsHoje >= LIMITE) {
    throw new AppError(
      `Daily email limit (${LIMITE}) reached for this company.`,
      429,
      'EMAIL_LIMIT_REACHED',
      true
    );
  }

  // ➕ Incrementa contador
  await pool.execute(
    `UPDATE empresas 
     SET emails_enviados_hoje = emails_enviados_hoje + 1,
         data_ultimo_envio = CURDATE()
     WHERE id_empresa = ?`,
    [id_empresa]
  );
}