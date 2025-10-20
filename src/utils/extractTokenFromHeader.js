//extractTokenFromHeader.js
export function extractTokenFromHeader(headers) {
    const authHeader = headers["authorization"] || headers["Authorization"];
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
  
    const token = authHeader.split(" ")[1];
    return token;
  }
  