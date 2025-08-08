import { NextRequest, NextResponse } from 'next/server';
import { getRaffles, supabase, isAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const raffles = await getRaffles(status, limit, offset);
    return NextResponse.json({ raffles });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const raffleData = {
      ...body,
      created_by: user.id,
    };
    
    const { data: raffle, error } = await supabase
      .from('raffles')
      .insert([raffleData])
      .select()
      .single();

    if (error) {
      console.error('Error creating raffle:', error);
      return NextResponse.json({ error: 'Failed to create raffle' }, { status: 500 });
    }

    return NextResponse.json({ raffle }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}