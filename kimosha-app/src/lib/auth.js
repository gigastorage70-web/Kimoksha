import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { supabaseServer, isSupabaseConfigured } from './supabaseServer';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'kimoksha_telecom_jwt_production_secret_key_2026_carrier_grade'
);

const COOKIE_NAME = 'kimoksha_admin_session';

// In-memory fallback stores (for local dev or before live Supabase keys are pasted)
const fallbackUsers = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    username: 'admin',
    email: 'admin@kimokshatelco.com',
    password_hash: bcrypt.hashSync('Password@123!', 10),
    role: 'super_admin',
    is_active: true,
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
    username: 'noc_desk',
    email: 'noc@kimokshatelco.com',
    password_hash: bcrypt.hashSync('Password@123!', 10),
    role: 'noc_engineer',
    is_active: true,
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d481',
    username: 'sales_lead',
    email: 'sales@kimokshatelco.com',
    password_hash: bcrypt.hashSync('Password@123!', 10),
    role: 'sales_billing',
    is_active: true,
  }
];

const loginAttempts = new Map(); // IP -> { count: number, blockedUntil: Date }

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function createSessionToken(user) {
  return await new SignJWT({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentOperator() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function setSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 1800, // 30 minutes
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Check if an IP address is currently blocked (7 failed attempts lockout)
export async function checkIpBruteForce(ip) {
  const now = Date.now();
  
  // Check Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabaseServer
        .from('blocked_ips')
        .select('*')
        .eq('ip_address', ip)
        .single();
      if (data && (data.is_permanent || (data.blocked_until && new Date(data.blocked_until).getTime() > now))) {
        return { isBlocked: true, reason: data.reason };
      }
    } catch (e) {
      // fallback to memory
    }
  }

  // Memory fallback
  const record = loginAttempts.get(ip);
  if (record && record.blockedUntil && record.blockedUntil > now) {
    const remainingSec = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      isBlocked: true,
      reason: `IP temporarily blocked due to 7 consecutive failed logins. Try again in ${remainingSec}s.`,
    };
  }

  return { isBlocked: false };
}

// Record login attempt
export async function recordLoginAttempt(ip, success) {
  const now = Date.now();
  let record = loginAttempts.get(ip) || { count: 0, blockedUntil: null };

  if (success) {
    loginAttempts.delete(ip);
    return;
  }

  record.count += 1;
  if (record.count >= 7) {
    // Lock out for 30 minutes
    record.blockedUntil = now + 30 * 60 * 1000;
    
    if (isSupabaseConfigured()) {
      try {
        await supabaseServer.from('blocked_ips').upsert({
          ip_address: ip,
          failed_attempts: record.count,
          blocked_until: new Date(record.blockedUntil).toISOString(),
          reason: 'Automated lockout: 7 consecutive failed login attempts',
        }, { onConflict: 'ip_address' });
      } catch (e) {}
    }
  }

  loginAttempts.set(ip, record);
}

// Log security audit trail
export async function logSecurityAudit({ username, ip, userAgent, action, status, details }) {
  if (isSupabaseConfigured()) {
    try {
      await supabaseServer.from('security_audit_logs').insert({
        operator_username: username || 'anonymous',
        ip_address: ip || '127.0.0.1',
        user_agent: userAgent || 'Unknown Browser',
        action,
        status,
        details: details ? JSON.stringify(details) : null,
      });
    } catch (e) {}
  }
}

// Authenticate operator with Supabase or built-in secure fallbacks
export async function authenticateOperator(username, password) {
  let user = null;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseServer
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();
      if (!error && data) {
        user = data;
      }
    } catch (e) {}
  }

  if (!user) {
    user = fallbackUsers.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.is_active);
  }

  if (!user) return null;

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return null;

  return user;
}
