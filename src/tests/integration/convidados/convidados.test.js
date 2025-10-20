import request from 'supertest';
import app from '../../../../src/app.js';
import path from 'path';
import fs from 'fs';

import db from '../../../../src/db/db.js';

import { generateToken } from '../../../../src/utils/generateToken.js';
import bcrypt from 'bcrypt';  // Importa direto no topo

describe('POST /api/convidados/registerConvidado', () => {
  let token;
  let adminUserId;
  let convidadoCpf;
  const adminEmail = `admin${Date.now()}@teste.com`;

  beforeAll(async () => {
    // Cria hash da senha
    const senhaHash = await bcrypt.hash('admin123', 10);

    // Insere usuário admin no banco
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, tipo_user, id_base, id_empresa)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Admin Test', adminEmail, senhaHash, 'A', 1, 1]
    );
    adminUserId = result.insertId;

    // Gera token com a função importada
    token = generateToken(
      {
        id: adminUserId,
        email: adminEmail,
        tipo_user: 'A',
        id_empresa: 1,
      },
      '1h'
    );
  });

  afterAll(async () => {
    // Remove usuário admin e convidado do banco
    await db.query('DELETE FROM users WHERE id_user = ?', [adminUserId]);
    if (convidadoCpf) {
      await db.query('DELETE FROM convidados WHERE cpf = ?', [convidadoCpf]);
      await db.end(); // <- ENCERRA A CONEXÃO
    }
    // Opcional: fechar conexão com o banco se quiser
    // await db.end();
  });

  it('deve registrar um novo convidado com sucesso', async () => {
    convidadoCpf = `07966282899`;
    const filePath = path.join(__dirname, '../../files/test-image.jpg');

    const res = await request(app)
      .post('/api/convidados/registerConvidado')
      .set('Authorization', `Bearer ${token}`)
      .field('nome', 'Convidado Teste')
      .field('cpf', convidadoCpf)
      .attach('foto', filePath);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/cadastrado/i);

    expect(res.body.data.convidado).toHaveProperty('foto');
    const fotoSalva = res.body.data.convidado.foto;

    expect(typeof fotoSalva).toBe('string');
    expect(fotoSalva).toMatch(/\.(jpg|jpeg|png)$/i);

    const savedPath = path.join('src/uploads', fotoSalva);
    const exists = fs.existsSync(savedPath);
    expect(exists).toBe(true);
  });

  it('deve retornar 401 se o token de autenticação não for fornecido', async () => {
    const filePath = path.join(__dirname, '../../files/test-image.jpg');
  
    const res = await request(app)
      .post('/api/convidados/registerConvidado')
      .field('nome', 'Convidado Sem Token')
      .field('cpf', '12345678900')
      .attach('foto', filePath);
  
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('deve retornar 400 se a imagem não for enviada', async () => {
    const res = await request(app)
      .post('/api/convidados/registerConvidado')
      .set('Authorization', `Bearer ${token}`)
      .field('nome', 'Sem Foto')
      .field('cpf', '98765432100');
  
    expect(res.status).toBe(400); // ou outro código conforme seu handler
    expect(res.body).toHaveProperty('message');
  });

});
