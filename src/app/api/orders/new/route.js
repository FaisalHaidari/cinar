import prisma from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newOrdersCount = await prisma.order.count({
      where: {
        isNew: true,
      },
    });

    return NextResponse.json({ success: true, newOrdersCount });
  } catch (error) {
    console.error('Error checking new orders:', error);
    return NextResponse.json({ error: 'Failed to check new orders', details: error?.message }, { status: 500 });
  }
} 