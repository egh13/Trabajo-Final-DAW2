import type { Request } from 'express';

// Extrae la IP real del cliente y la normaliza a formato IPv4
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.ip ?? req.socket.remoteAddress ?? '0.0.0.0';

  // Convierte IPv4-mapped IPv6 (::ffff:x.x.x.x) a IPv4 puro
  return raw.startsWith('::ffff:') ? raw.slice(7) : raw;
};

