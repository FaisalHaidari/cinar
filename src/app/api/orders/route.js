import prisma from '../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true, // Include user details for each order
        items: { include: { product: true } } // Include product details for each order item
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error, error?.meta);
    return NextResponse.json({ error: 'Failed to fetch orders', details: error?.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const { cartItems, phone, street, buildingNo, floor, apartmentNo, description, postalCode, city, country, total } = data;
  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        phone,
        street,
        buildingNo,
        floor,
        apartmentNo,
        description,
        postalCode,
        city,
        country,
        items: {
          create: cartItems.map(item => ({
            quantity: item.quantity || 1,
            price: item.price,
            productId: item.id,
          }))
        }
      },
      include: { 
        items: { 
          include: { 
            product: true 
          }
        }
      }
    });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error, error?.meta);
    return NextResponse.json({ error: 'Order creation failed', details: error?.message }, { status: 500 });
  }
} 