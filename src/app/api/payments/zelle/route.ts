import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { 
      raffleId, 
      numbers, 
      amount, 
      userEmail, 
      userName, 
      userWhatsapp 
    } = await request.json();

    // Zelle payment instructions
    const zelleEmail = process.env.ZELLE_EMAIL || 'payments@chanspaw.com';
    const zellePhone = process.env.ZELLE_PHONE || '+1234567890';

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        raffle_id: raffleId,
        user_email: userEmail,
        amount,
        currency: 'USD',
        payment_method: 'zelle',
        payment_status: 'pending',
        numbers,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating Zelle payment:', error);
      return NextResponse.json({ error: 'Failed to create Zelle payment' }, { status: 500 });
    }

    return NextResponse.json({
      zelleEmail,
      zellePhone,
      amount,
      paymentId: payment.id,
      reference: `CHANS-${payment.id.substring(0, 8).toUpperCase()}`,
      instructions: [
        'Open your banking app',
        'Select Zelle',
        `Send $${amount} to ${zelleEmail}`,
        `Use reference: CHANS-${payment.id.substring(0, 8).toUpperCase()}`,
        'Screenshot the confirmation and send to us'
      ]
    });
  } catch (error) {
    console.error('Zelle API Error:', error);
    return NextResponse.json({ error: 'Zelle payment failed' }, { status: 500 });
  }
}