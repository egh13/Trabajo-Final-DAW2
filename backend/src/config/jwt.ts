import dotenv from 'dotenv'
dotenv.config()

export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'secure_tenis_dev_secret_key_2024',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
}
