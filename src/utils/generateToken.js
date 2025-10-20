//generateToken.js
import jwt from "jsonwebtoken";

export function generateToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}
