import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { 
      raffleId, 
      numbers, 
      amount, 
      currency, 
      userEmail, 
      userName, 
      userWhatsapp 
    } = await request.json();

    // Simulate Stripe payment intent creation
    const paymentIntentId = `pi_${Math.random().toString(36).substring(7)}`;

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        raffle_id: raffleId,
        user_email: userEmail,
        amount,
        currency,
        payment_method: 'stripe',
        payment_status: 'pending',
        payment_intent_id: paymentIntentId,
        numbers,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating payment record:', error);
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: `${paymentIntentId}_secret_test`,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}