import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const secretKey = process.env.JWT_SECRET || 'super-secret-jwt-key-for-mes-courses-faciles';
const key = new TextEncoder().encode(secretKey);

export async function signJWT(payload: JWTPayload, expiresIn: string | number = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}
