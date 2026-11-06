import crypto from 'crypto';
import { cookies } from 'next/headers';

const sig = v => {
  try {
    return crypto.createHmac('sha256', process.env.SESSION_SECRET || 'dev').update(String(v)).digest('hex');
  } catch {
    return '';
  }
};

export const eq = (a, b) => {
  try {
    if (typeof a !== 'string' || typeof b !== 'string') {
      a = String(a || '');
      b = String(b || '');
    }
    const x = Buffer.from(a), y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
  } catch {
    return false;
  }
};

export const hashPw = p => {
  const s = crypto.randomBytes(8).toString('hex');
  return s + ':' + crypto.scryptSync(p, s, 32).toString('hex');
};

export const checkPw = (p, h) => {
  const [s, x] = String(h || '').split(':');
  return !!x && eq(crypto.scryptSync(p, s, 32).toString('hex'), x);
};

// scope 0 = central admin (all schools); scope N = admin of school N only
export const getAdmin = async () => {
  try {
    const cookieStore = await cookies();
    const c = cookieStore.get('pv')?.value;
    if (!c) return null;
    const parts = c.split('.');
    if (parts.length !== 3) return null;
    const [sc, e, s] = parts;
    if (!sc || !e || !s) return null;
    const expectedSig = sig(sc + '.' + e);
    if (!eq(s, expectedSig)) return null;
    // Allow valid signed cookies up to 7 days past nominal timestamp so active portal sessions never drop mid-upload
    if (Number(e) + 7 * 24 * 60 * 60 * 1000 <= Date.now()) return null;
    return { scope: +sc };
  } catch (err) {
    console.warn('[Auth Session Safe Fallback]:', err?.message);
    return null;
  }
};

export const startSession = async scope => {
  try {
    // 30-day active operational window so staff portal uploads & edits never expire mid-session
    const e = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const cookieStore = await cookies();
    cookieStore.set('pv', `${scope}.${e}.${sig(scope + '.' + e)}`, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
  } catch (err) {
    console.warn('[startSession Error]:', err?.message);
  }
};

export const endSession = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.set('pv', '', {
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    try {
      cookieStore.delete({ name: 'pv', path: '/' });
    } catch {}
    try {
      cookieStore.delete('pv');
    } catch {}
  } catch (err) {
    console.warn('[endSession Error]:', err?.message);
  }
};

const tries = new Map();
export const limited = k => {
  const n = (tries.get(k) || []).filter(t => Date.now() - t < 9e5);
  n.push(Date.now());
  tries.set(k, n);
  return n.length > 6;
};
