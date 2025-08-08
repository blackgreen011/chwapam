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

    // Generate PIX payment data (simplified - in production use a real PIX provider)
    const pixKey = process.env.PIX_KEY || 'chanspaw@example.com';
    const pixCode = generatePixCode(amount, pixKey, `Sorteio ${raffleId}`);

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        raffle_id: raffleId,
        user_email: userEmail,
        amount,
        currency: 'BRL',
        payment_method: 'pix',
        payment_status: 'pending',
        numbers,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating PIX payment:', error);
      return NextResponse.json({ error: 'Failed to create PIX payment' }, { status: 500 });
    }

    return NextResponse.json({
      pixCode,
      pixKey,
      amount,
      paymentId: payment.id,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    });
  } catch (error) {
    console.error('PIX API Error:', error);
    return NextResponse.json({ error: 'PIX payment failed' }, { status: 500 });
  }
}

function generatePixCode(amount: number, pixKey: string, description: string): string {
  // Simplified PIX code generation - in production use proper PIX library
  const payload = {
    pixKey,
    amount: amount.toFixed(2),
    description,
    txid: Math.random().toString(36).substring(7),
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}