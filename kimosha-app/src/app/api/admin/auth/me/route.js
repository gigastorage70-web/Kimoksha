import { NextResponse } from 'next/server';
import { getCurrentOperator } from '@/lib/auth';

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      operator: {
        id: operator.id,
        username: operator.username,
        email: operator.email,
        role: operator.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
