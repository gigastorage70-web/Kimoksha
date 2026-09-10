import { NextResponse } from 'next/server';
import { getCurrentOperator } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function GET(request, { params }) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    let notes = [];

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer
        .from('lead_internal_notes')
        .select('*')
        .eq('lead_id', id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        notes = data;
      }
    }

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { note_text } = await request.json();

    if (!note_text || !note_text.trim()) {
      return NextResponse.json({ success: false, error: 'Note text is required.' }, { status: 400 });
    }

    let returnedNote = {
      id: `note-${Date.now()}`,
      lead_id: id,
      author_name: operator.username,
      author_role: operator.role || 'Operator',
      note_text: note_text.trim(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer
        .from('lead_internal_notes')
        .insert({
          lead_id: id,
          author_name: operator.username,
          author_role: operator.role || 'Operator',
          note_text: note_text.trim(),
        })
        .select()
        .single();

      if (!error && data) {
        returnedNote = data;
      }
    }

    return NextResponse.json({ success: true, note: returnedNote });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
