import prisma from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.order.updateMany({
      where: {
        isNew: true,
      },
      data: {
        isNew: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking orders as viewed:', error);
    return NextResponse.json({ error: 'Failed to mark orders as viewed', details: error?.message }, { status: 500 });
  }
} 