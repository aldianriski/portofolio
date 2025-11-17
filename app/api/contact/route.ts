import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/infrastructure/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, locale } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert message into database
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name,
        email,
        message,
        locale: locale || 'en',
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving contact message:', error);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
