import { createAdminUser } from '../helpers/createAdminUser.js';
import { createStandardUser } from '../helpers/createStandardUser.js';
import { createGuest } from '../helpers/createGuest.js';
import { createInvite } from '../helpers/createInvite.js';

export async function createInviteFlow() {

  const admin = await createAdminUser();

  const user = await createStandardUser();

  const cpf = `${Date.now()}`.slice(-11); // gera CPF único para teste

  await createGuest(user.token, cpf);

  await createInvite(user.token, cpf);

  return {
    admin,
    user,
    cpf
  };

}