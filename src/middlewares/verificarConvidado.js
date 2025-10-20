//verificarConvidado.js
import fs from 'fs';
import path from 'path';
import pool from './../db/db.js';
import { normalizarCPF, validarCPF } from '../utils/cpfUtils.js';

export async function VerificarConvidado(req, res, next) {
    console.log('verificando');
    const { cpf } = req.body;

    if (!cpf) {
        return res.status(400).json({ message: 'CPF é obrigatório.' });
    }

    const cpfLimpo = normalizarCPF(cpf);

    if (!validarCPF(cpfLimpo)) {
        removerArquivo(req);
        return res.status(400).json({ message: 'CPF inválido.' });
    }

    const sql = 'SELECT id_convidado FROM convidados WHERE cpf = ?';

    try {
        const [rows] = await pool.execute(sql, [cpfLimpo]);

        if (rows.length > 0) {
            removerArquivo(req);
            return res.status(400).json({ message: 'O Convidado já está cadastrado.' });
        }

        next();

    } catch (error) {
        removerArquivo(req);
        console.error('Erro ao verificar cpf:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

function removerArquivo(req) {
    if (req.file) {
        const caminho = path.resolve('src', 'uploads', req.file.filename);
        fs.unlink(caminho, (err) => {
            if (err) {
                console.error('Erro ao remover arquivo:', err);
            } else {
                console.log('Arquivo removido:', req.file.filename);
            }
        });
    }
}
