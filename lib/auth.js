import crypto from 'crypto';
import { cookies } from 'next/headers';
const sig = v => crypto.createHmac('sha256', process.env.SESSION_SECRET || 'dev').update(v).digest('hex');
export const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
export const hashPw = p => { const s = crypto.randomBytes(8).toString('hex'); return s + ':' + crypto.scryptSync(p, s, 32).toString('hex'); };
export const checkPw = (p, h) => { const [s, x] = String(h || '').split(':'); return !!x && eq(crypto.scryptSync(p, s, 32).toString('hex'), x); };
// scope 0 = central admin (all schools); scope N = admin of school N only
export const getAdmin = async () => { const c = (await cookies()).get('pv')?.value; if (!c) return null; const [sc, e, s] = c.split('.'); return +e > Date.now() && eq(s || '', sig(sc + '.' + e)) ? { scope: +sc } : null; };
export const startSession = async scope => { const e = Date.now() + 6 * 36e5; (await cookies()).set('pv', `${scope}.${e}.${sig(scope + '.' + e)}`, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' }); };
export const endSession = async () => (await cookies()).delete('pv');
const tries = new Map();
export const limited = k => { const n = (tries.get(k) || []).filter(t => Date.now() - t < 9e5); n.push(Date.now()); tries.set(k, n); return n.length > 6; };
