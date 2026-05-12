/**
 * Utilidades de formato compartidas entre las vistas del panel de administración.
 */

/** Formatea una fecha ISO a formato legible dd/mm/aaaa hh:mm */
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

/** Normaliza IPs IPv4-mapped IPv6 (::ffff:x.x.x.x) a formato IPv4 puro */
export const normalizeIp = (ip: string): string =>
  ip.startsWith('::ffff:') ? ip.slice(7) : (ip || '—')
