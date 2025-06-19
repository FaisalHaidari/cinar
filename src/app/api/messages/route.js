import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';

// Mevcut kullanıcıdan veya yönetici için tüm mesajları al
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  let messages;

  if (session?.user?.admin) {
    // Yönetici tüm mesajları görür
    messages = await prisma.message.findMany({
      include: { sender: true, receiver: true },
      orderBy: { createdAt: 'asc' }
    });
  } else {
    // Kullanıcı sadece kendi mesajlarını görür
    messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ]
      },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: 'asc' }
    });
  }
  return NextResponse.json(messages);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { receiverId, content, isToAdmin } = await req.json();

  if (isToAdmin) {
    // Eğer normal kullanıcı ise sadece yöneticiye mesaj gönderebilir
    const adminUser = await prisma.user.findFirst({ where: { admin: true } });
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: adminUser.id,
        content,
      },
    });
    return NextResponse.json(message);
  } else {
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
      },
    });
    return NextResponse.json(message);
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { userId } = await req.json();

  if (session?.user?.admin) {
    // Mesajları okundu olarak işaretle (yönetici tarafında)
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });
    // Bu kullanıcıdan yöneticiye gelen tüm okunmamış mesajları okundu olarak işaretle
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });
  } else {
    // Kullanıcı: Yönetici tarafından kendisine gelen tüm mesajları okundu olarak işaretle
    await prisma.message.updateMany({
      where: {
        senderId: session.user.id,
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });
    await prisma.message.updateMany({
      where: {
        senderId: { not: session.user.id }, // Diğer kullanıcıların gönderdiği mesajlar
        receiverId: session.user.id,
        read: false,
      },
      data: { read: true },
    });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (userId) {
    // Belirli bir kullanıcıya ait tüm mesajları sil (sadece yönetici)
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: parseInt(userId) },
          { receiverId: parseInt(userId) },
        ],
      },
    });
    // Kullanıcıyı da sil
    await prisma.user.delete({ where: { id: parseInt(userId) } });
  } else {
    // Tüm mesajları sil (sadece yönetici)
    await prisma.message.deleteMany({});
  }
  return NextResponse.json({ success: true });
} 