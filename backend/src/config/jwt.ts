import dotenv from 'dotenv'
dotenv.config()

export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? '6186d1d461c4a8b48190cfc6d42f5823',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
}
