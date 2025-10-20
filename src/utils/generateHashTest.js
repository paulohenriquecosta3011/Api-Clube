//generateHashTest.js
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export  async function generateHash(password) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('Erro ao gerar hash:', error);
    throw error;
  }
}

(async () => {
  const senha = 'admin123'; // substitua pela senha que quer gerar o hash
  const hash = await generateHash(senha);
//  console.log('Hash gerado:', hash);
})();
