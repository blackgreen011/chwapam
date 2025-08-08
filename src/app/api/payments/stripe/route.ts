import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

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

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        raffleId,
        numbers: JSON.stringify(numbers),
        userEmail,
        userName,
        userWhatsapp,
      },
    });

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
        payment_intent_id: paymentIntent.id,
        numbers,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating payment record:', error);
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}