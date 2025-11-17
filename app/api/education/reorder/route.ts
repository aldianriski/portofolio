import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { verifyAuth } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authError = await verifyAuth(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Batch update all items
    const updatePromises = items.map((item: { id: string; order_index: number }) =>
      supabase
        .from('education')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    );

    const results = await Promise.all(updatePromises);

    // Check if any update failed
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error('Reorder errors:', errors);
      return NextResponse.json(
        { error: 'Failed to update some items' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error reordering education:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
