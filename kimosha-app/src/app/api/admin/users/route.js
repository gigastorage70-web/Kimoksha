import { NextResponse } from 'next/server';
import { getCurrentOperator, hashPassword, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

function formatTimeAgo(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  if (diffSec < 172800) return 'Yesterday';
  return `${Math.floor(diffSec / 86400)} days ago`;
}

// GET: List all live operators from Supabase
export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured' },
        { status: 500 }
      );
    }

    // 1. Fetch live admin_users
    const { data: dbUsers, error: usersError } = await supabaseServer
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Failed to fetch admin_users:', usersError);
      return NextResponse.json({ success: false, error: usersError.message }, { status: 500 });
    }

    // 2. Fetch operator metadata from site_settings (category: 'OPERATORS')
    const { data: metaRows } = await supabaseServer
      .from('site_settings')
      .select('*')
      .eq('category', 'OPERATORS');

    const metaMap = {};
    if (metaRows && metaRows.length > 0) {
      metaRows.forEach((row) => {
        try {
          const userId = row.setting_key.replace('op_meta_', '');
          metaMap[userId] = JSON.parse(row.setting_value);
        } catch (e) {}
      });
    }

    // 3. Format into rich operator records
    const users = (dbUsers || []).map((u) => {
      const meta = metaMap[u.id] || {};
      const defaultName = u.username === 'admin' ? 'Carrier Operations Lead' : u.username;
      return {
        id: u.id,
        name: meta.full_name || defaultName,
        username: u.username,
        email: u.email,
        role: u.role || 'noc_operator',
        mfa_enabled: meta.mfa_enabled !== undefined ? meta.mfa_enabled : true,
        email_verified: meta.email_verified !== undefined ? meta.email_verified : true,
        last_login: u.last_login_at
          ? formatTimeAgo(u.last_login_at)
          : u.username === 'admin'
          ? 'Just now'
          : 'Never',
        status: u.is_active ? 'ACTIVE' : 'SUSPENDED',
        created_at: u.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching operators:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching operators' },
      { status: 500 }
    );
  }
}

// POST: Provision a new console operator in Supabase
export async function POST(request) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase database is not connected' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, username, email, password, role, email_verified, mfa_enabled } = body;

    // Validate Username
    const cleanUsername = (username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters (alphanumeric and underscores only).' },
        { status: 400 }
      );
    }

    // Validate Corporate Email
    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'A valid corporate email address is required.' },
        { status: 400 }
      );
    }

    // Validate Password
    const cleanPassword = (password || '').trim();
    if (!cleanPassword || cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Normalize Role
    const roleMapping = {
      SUPER_ADMIN: 'super_admin',
      NOC_OPERATOR: 'noc_operator',
      CARRIER_MANAGER: 'carrier_manager',
      SALES_REP: 'sales_rep',
      super_admin: 'super_admin',
      noc_operator: 'noc_operator',
      carrier_manager: 'carrier_manager',
      sales_rep: 'sales_rep',
    };
    const cleanRole = roleMapping[role] || 'noc_operator';
    const cleanName = (name || '').trim() || cleanUsername;

    // Check if username or email already exists in Supabase
    const { data: existing, error: checkError } = await supabaseServer
      .from('admin_users')
      .select('id, username, email')
      .or(`username.ilike.${cleanUsername},email.ilike.${cleanEmail}`);

    if (existing && existing.length > 0) {
      const match = existing[0];
      if (match.username.toLowerCase() === cleanUsername) {
        return NextResponse.json(
          { success: false, error: `Operator username "@${cleanUsername}" is already in use.` },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: `Corporate email "${cleanEmail}" is already registered.` },
        { status: 409 }
      );
    }

    // Hash the password with bcrypt (10 rounds)
    const password_hash = await hashPassword(cleanPassword);

    // Insert operator into Supabase admin_users
    const { data: createdUser, error: insertError } = await supabaseServer
      .from('admin_users')
      .insert({
        username: cleanUsername,
        email: cleanEmail,
        password_hash,
        role: cleanRole,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase admin_users insert error:', insertError);
      return NextResponse.json(
        { success: false, error: `Database insertion error: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Upsert operator metadata (full name, verification, MFA status) in site_settings
    await supabaseServer.from('site_settings').upsert(
      {
        setting_key: `op_meta_${createdUser.id}`,
        setting_value: JSON.stringify({
          full_name: cleanName,
          email_verified: email_verified !== false,
          mfa_enabled: Boolean(mfa_enabled),
        }),
        category: 'OPERATORS',
      },
      { onConflict: 'setting_key' }
    );

    // Log security audit trail
    await logSecurityAudit({
      username: operator.username,
      action: 'OPERATOR_PROVISIONED',
      status: 'SUCCESS',
      details: {
        new_operator_id: createdUser.id,
        new_username: cleanUsername,
        role: cleanRole,
        email: cleanEmail,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Operator "@${cleanUsername}" provisioned successfully with role ${cleanRole.toUpperCase().replace(/_/g, ' ')}.`,
      user: {
        id: createdUser.id,
        name: cleanName,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
        mfa_enabled: Boolean(mfa_enabled),
        email_verified: email_verified !== false,
        last_login: 'Never',
        status: 'ACTIVE',
        created_at: createdUser.created_at,
      },
    });
  } catch (error) {
    console.error('Error provisioning operator:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while creating operator' },
      { status: 500 }
    );
  }
}

// DELETE: Revoke and remove an operator account from Supabase
export async function DELETE(request) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase database is not connected' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Operator ID is required' }, { status: 400 });
    }

    // Lookup user to verify root protection
    const { data: targetUser, error: lookupError } = await supabaseServer
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (lookupError || !targetUser) {
      return NextResponse.json({ success: false, error: 'Operator not found' }, { status: 404 });
    }

    // Protect primary root super admin
    if (targetUser.username.toLowerCase() === 'admin') {
      return NextResponse.json(
        { success: false, error: 'The primary root Super Admin (@admin) account cannot be deleted.' },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (targetUser.id === operator.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot revoke your own active operator account.' },
        { status: 400 }
      );
    }

    // Delete from admin_users
    const { error: deleteError } = await supabaseServer.from('admin_users').delete().eq('id', id);

    if (deleteError) {
      console.error('Failed to delete operator:', deleteError);
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
    }

    // Clean up metadata
    await supabaseServer.from('site_settings').delete().eq('setting_key', `op_meta_${id}`);

    // Log security audit
    await logSecurityAudit({
      username: operator.username,
      action: 'OPERATOR_REVOKED',
      status: 'SUCCESS',
      details: {
        revoked_operator_id: id,
        revoked_username: targetUser.username,
        revoked_email: targetUser.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Operator credentials for @${targetUser.username} have been successfully revoked and purged.`,
    });
  } catch (error) {
    console.error('Error deleting operator:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while revoking operator' },
      { status: 500 }
    );
  }
}
