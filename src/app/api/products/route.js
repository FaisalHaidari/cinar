import prisma from '../../../lib/db';
import { NextResponse } from 'next/server';

// Get all menu items
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: category ? {
        category: {
          name: category
        }
      } : undefined,
      include: {
        category: true
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// Create a new menu item
export async function POST(req) {
  const data = await req.json();
  const item = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      categoryId: Number(data.categoryId),
    },
  });
  return NextResponse.json(item);
}

// Update or delete a menu item by id
export async function PUT(req) {
  const data = await req.json();
  const item = await prisma.product.update({
    where: { id: Number(data.id) },
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      categoryId: Number(data.categoryId),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
} 