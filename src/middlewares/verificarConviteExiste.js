import { AppError } from "../utils/AppError.js";
import { normalizarCPF } from "../utils/cpfUtils.js";
import pool from "../db/db.js";

export async function verificarConviteExiste(req, res, next) {
  try {
    const { cpf_convidado, dataconvite } = req.body || {};

    // ✅ se campos não vieram → deixa service validar
    if (!cpf_convidado || !dataconvite) {
      return next();
    }

    const cpfNormalizado = normalizarCPF(cpf_convidado);

    const sql =
      "SELECT id_convite FROM convites WHERE cpf_convidado = ? AND DATE(dataconvite) = ?";

    const [rows] = await pool.execute(sql, [cpfNormalizado, dataconvite]);

    if (rows.length > 0) {
      throw new AppError(
        `Este convidado já tem convite para a data de: ${dataconvite}`,
        409
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}