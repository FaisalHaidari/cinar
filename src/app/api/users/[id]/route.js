import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req, { params }) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const updateData = {
    name: data.name,
    phone: data.phone,
    street: data.street,
    postalCode: data.postalCode,
    city: data.city,
    country: data.country,
  };
  if (typeof data.admin === 'boolean') {
    updateData.admin = data.admin;
  }
  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data: updateData,
  });
  return NextResponse.json(user);
}

export async function DELETE(req, { params }) {
  try {
    await prisma.user.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'User not found or could not be deleted' }, { status: 404 });
  }
} 