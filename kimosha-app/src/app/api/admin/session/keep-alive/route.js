import { NextResponse } from 'next/server';
import { getCurrentOperator, createSessionToken, setSessionCookie } from '@/lib/auth';

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }

    // Refresh the JWT session for another 30 minutes
    const refreshedToken = await createSessionToken(operator);
    await setSessionCookie(refreshedToken);

    return NextResponse.json({
      success: true,
      message: 'Session refreshed successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Session refresh failed' }, { status: 500 });
  }
}
