import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';

export async function POST() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Purge and revalidate Next.js cache trees
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/dashboard');
      revalidatePath('/admin/analytics');
      revalidatePath('/admin/leads');
      revalidatePath('/admin/rate-decks');
      revalidatePath('/admin/forms');
      revalidatePath('/admin/settings');
    } catch (err) {
      console.warn('Revalidation warning:', err);
    }

    // Log security audit record
    await logSecurityAudit({
      username: operator.username,
      action: 'SYSTEM_CACHE_PURGED',
      status: 'SUCCESS',
      details: { timestamp: new Date().toISOString() },
    });

    return NextResponse.json({
      success: true,
      message: 'Global site cache flushed: Server routes revalidated and frontend memory wiped.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
