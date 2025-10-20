import request from 'supertest';
import app from '../../../../src/app.js'; // ajuste o caminho se necessário
import db from '../../../../src/db/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../../../src/utils/generateToken.js'; // ajuste o caminho conforme seu projeto

let adminToken;
const adminUser = {
  name: 'Admin Test',
  email: 'admin@example.com',
  password: 'admin123',
  tipo_user: 'A',
  id_base: 1,
  id_empresa: 1
};

beforeAll(async () => {
  // Remove admin se já existir
  await db.query('DELETE FROM users WHERE email = ?', [adminUser.email]);

  const hashedPassword = await bcrypt.hash(adminUser.password, 10);

  // Cria admin diretamente no banco
  await db.query(
    `INSERT INTO users (name, email, password, tipo_user, id_base, id_empresa) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      adminUser.name,
      adminUser.email,
      hashedPassword,
      adminUser.tipo_user,
      adminUser.id_base,
      adminUser.id_empresa
    ]
  );

  // Pega o usuário criado para extrair id e outros dados
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [adminUser.email]);
  const insertedUser = rows[0];

  // Gera token com os dados do usuário admin criado
  adminToken = generateToken({
    id: insertedUser.id_user,
    email: insertedUser.email,
    tipo_user: insertedUser.tipo_user,
    id_empresa: insertedUser.id_empresa
  }, "1h");
});

afterAll(async () => {
  // Limpa usuários criados no teste (inclusive o admin)
  await db.query('DELETE FROM users WHERE email IN (?, ?)', [
    adminUser.email,
    'newuser@example.com'
  ]);
  await db.end(); // Encerra conexão
});

describe('POST /api/users/register', () => {
  it('deve permitir que admin cadastre novo usuário simples', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Novo Usuário',
        email: 'newuser@example.com',
        id_base: 1,
        tipo_user: 'S'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuário registrado com sucesso!');
    expect(response.body.data.user).toHaveProperty('id');
    expect(response.body.data.user.email).toBe('newuser@example.com');
  });


  it('não deve permitir cadastro sem token de autenticação', async () => {
  const response = await request(app)
    .post('/api/users/register')
    .send({
      name: 'Sem Token',
      email: 'sem_token@example.com',
      id_base: 1,
      tipo_user: 'S'
    });

  expect(response.status).toBe(401);
  expect(response.body.message).toMatch(/Token não fornecido/i);
});



it('não deve permitir que usuário simples cadastre outro usuário', async () => {
  // Cria usuário simples
  const hashedPassword = await bcrypt.hash('senha123', 10);
  await db.query(
    `INSERT INTO users (name, email, password, tipo_user, id_base, id_empresa) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['Usuário Simples', 'simples@example.com', hashedPassword, 'S', 1, 1]
  );

  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', ['simples@example.com']);
  const userSimples = rows[0];

  const tokenSimples = generateToken({
    id: userSimples.id_user,
    email: userSimples.email,
    tipo_user: userSimples.tipo_user,
    id_empresa: userSimples.id_empresa
  }, "1h");

  const response = await request(app)
    .post('/api/users/register')
    .set('Authorization', `Bearer ${tokenSimples}`)
    .send({
      name: 'Tentativa Indevida',
      email: 'indevido@example.com',
      id_base: 1,
      tipo_user: 'S'
    });

  expect(response.status).toBe(403);
  expect(response.body.message).toMatch(/Acesso negado/i);

  // Limpa o usuário simples criado
  await db.query('DELETE FROM users WHERE email = ?', ['simples@example.com']);
});

it('não deve permitir cadastro com e-mail já existente', async () => {
  const response = await request(app)
    .post('/api/users/register')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Usuário Duplicado',
      email: 'newuser@example.com', // mesmo do teste anterior
      id_base: 1,
      tipo_user: 'S'
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toMatch(/E-mail já está em uso/i);
});

});
