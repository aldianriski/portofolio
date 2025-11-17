import { NextRequest, NextResponse } from 'next/server';
import { settingsRepository } from '@/infrastructure/supabase/repositories/settings-repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    const contactSettings = await settingsRepository.getContactSettings(locale);

    if (!contactSettings) {
      return NextResponse.json(
        { error: 'Contact settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contactSettings);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
