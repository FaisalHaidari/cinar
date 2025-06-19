import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin');
  let users;
  if (isAdmin) {
    users = await prisma.user.findMany({ where: { admin: true } });
  } else {
    users = await prisma.user.findMany();
  }
  return NextResponse.json(users);
} 