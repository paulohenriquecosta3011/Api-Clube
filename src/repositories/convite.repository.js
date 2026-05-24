import pool from '../db/db.js';
import { AppError } from '../utils/AppError.js';

// ====================
// Criação de convites
// ====================
export async function createConvite({ cpf_convidado, id_user, dataconvite,token, ConvitePadrao = false }) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO convites (cpf_convidado, id_user, dataconvite, token, ConvitePadrao) VALUES (?, ?, ?, ?, ?)`,
      [cpf_convidado, id_user, dataconvite,token,ConvitePadrao]
    );

    return {
      id_convite: result.insertId,
      cpf_convidado,
      id_user,
      dataconvite,
      token,
      ConvitePadrao
    };

  } catch (error) {

    console.error('Database error while creating invite:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError(
        'An invite for this CPF and date already exists.',
        409,
        'INVITE_ALREADY_EXISTS'
      );
    }

    throw new AppError(
      'Failed to create invite.',
      500,
      'CREATE_INVITE_ERROR'
    );
  }
}
// ====================
// Busca convites de um usuário (opcionalmente filtrando por data inicial)
// ====================
export async function buscarConvitesPorUsuario({ id_user, data_inicial }) {
  try {
    let sql = `
    SELECT 
      c.id_convite,
      c.cpf_convidado,

      g.nome AS nome_convidado,
      g.telefone AS telefone_convidado,
      g.foto AS foto_convidado,

      c.dataconvite,
      c.status,
      c.token,

      CASE 
        WHEN EXISTS (
          SELECT 1
          FROM convites_downloads cd
          INNER JOIN maquinas m ON m.id_maquina = cd.id_maquina
          WHERE cd.id_convite = c.id_convite
            AND m.nome = 'PORTARIA'
        ) THEN 'Esta na Portaria'
        ELSE 'AGUARDANDO_PORTARIA'
      END AS status_portaria

    FROM convites c

    INNER JOIN convidados g
      ON g.cpf = c.cpf_convidado

    WHERE c.id_user = ?
    `;
    const params = [id_user];

    if (data_inicial) {
      sql += ' AND c.dataconvite >= ?';
      params.push(data_inicial);
    }

    sql += ' ORDER BY c.dataconvite DESC';
    
    const [rows] = await pool.execute(sql, params);
    return rows;

  } catch (error) {
    console.error('Database error while fetching user invites:', error);

    throw new AppError(
      'Failed to fetch user invites.',
      500,
      'FETCH_INVITES_ERROR'
    );
  }
}

// ====================
// Busca convites não baixados por máquina
// ====================
export async function buscarConvitesNaoBaixados({ id_maquina, id_user, data }) {
  try {
    let sql = `
      SELECT c.id_convite, c.cpf_convidado, c.id_user, c.dataconvite, c.status, c.token
      FROM convites c
      LEFT JOIN convites_downloads cd
        ON c.id_convite = cd.id_convite AND cd.id_maquina = ?
      WHERE cd.id_download IS NULL AND c.dataconvite >= ?
    `;
    const params = [id_maquina, data];

    if (id_user) {
      sql += " AND c.id_user = ?";
      params.push(id_user);
    }

    const [rows] = await pool.execute(sql, params);
    return rows;

  } catch (error) {
    console.error('Database error while fetching pending invites for download:', error);

    throw new AppError(
      'Failed to fetch invites for download.',
      500,
      'FETCH_DOWNLOAD_ERROR'
    );
  }
}

// ====================
// Registrar download de convite
// ====================
export async function registrarConviteBaixado({ id_maquina, id_convite }) {
  try {
    await pool.execute(
      "INSERT INTO convites_downloads (id_convite, id_maquina) VALUES (?, ?)",
      [id_convite, id_maquina]
    );
  } catch (error) {
  console.error('Database error while registering invite download:', error);

throw new AppError(
  'Failed to register invite download.',
  500,
  'REGISTER_DOWNLOAD_ERROR'
);

  }
}

export async function buscarConvitePorCpfEData(cpf_convidado, dataconvite,ConvitePadrao = false) {
  try {
    const [rows] = await pool.execute(
      `SELECT id_convite 
       FROM convites 
       WHERE cpf_convidado = ? AND dataconvite = ?  AND ConvitePadrao = ?`,
      [cpf_convidado, dataconvite, ConvitePadrao]
    );

    return rows[0] || null;
  } catch (error) {
    console.error('Database error while checking duplicate invite:', error);
    throw new AppError(
      'Failed to check duplicate invite.',
      500,
      'CHECK_DUPLICATE_INVITE_ERROR'
    );
  }
}


export async function buscarConvitePorToken(token) {

  try {

    const [rows] = await pool.execute(
      `SELECT id_convite FROM convites WHERE token = ? LIMIT 1`,
      [token]
    );

    return rows[0] || null;

  } catch (error) {

    console.error('Database error while fetching invite by token:', error);

    throw new AppError(
      'Failed to fetch invite by token.',
      500,
      'FETCH_INVITE_BY_TOKEN_ERROR'
    );

  }
}

export async function buscarConvitePublicoPorToken(token) {

  try {

    const [rows] = await pool.execute(
      `
      SELECT
        c.id_convite,
        c.dataconvite,
        c.status,
        c.token,

        g.nome,
        g.foto,
        g.telefone

      FROM convites c

      INNER JOIN convidados g
        ON g.cpf = c.cpf_convidado

      WHERE c.token = ?
      LIMIT 1
      `,
      [token]
    );

    return rows[0] || null;

  } catch (error) {

    console.error(
      'Database error while fetching public invite:',
      error
    );

    throw new AppError(
      'Failed to fetch public invite.',
      500,
      'FETCH_PUBLIC_INVITE_ERROR'
    );

  }
}