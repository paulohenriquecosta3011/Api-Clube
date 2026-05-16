// src/utils/generateInviteToken.js

import crypto from 'crypto';

export function generateInviteToken(size = 16) {

  return crypto
    .randomBytes(size)
    .toString('base64')
    .replace(/[+/=]/g, '')
    .substring(0, size)
    .toUpperCase();

}