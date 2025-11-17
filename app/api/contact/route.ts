import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/infrastructure/supabase/server';
import { contactFormRateLimiter, getClientIP } from '@/lib/rate-limit';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maximum lengths
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, locale, website } = body;

    // 1. Honeypot check - if 'website' field is filled, it's likely a bot
    if (website) {
      console.warn('Honeypot triggered - potential bot submission');
      // Return success to fool bots, but don't save
      return NextResponse.json({ success: true });
    }

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = await contactFormRateLimiter.check(clientIP);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 3. Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 4. Validate field lengths
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: 'Name is too long' },
        { status: 400 }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Email is too long' },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: 'Message is too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    // 5. Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 6. Sanitize inputs (basic trimming)
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      locale: locale || 'en',
      is_read: false,
    };

    // 7. Insert message into database
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      console.error('Error saving contact message:', error);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      remaining: rateLimitResult.remaining
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
