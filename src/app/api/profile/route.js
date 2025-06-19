import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, avatar, phone, street, postalCode, city, country } = body;
  if (!name || typeof name !== "string") {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        ...(avatar && { avatar }),
        ...(phone && { phone }),
        ...(street && { street }),
        ...(postalCode && { postalCode }),
        ...(city && { city }),
        ...(country && { country }),
      },
    });
    return Response.json({ success: true, user: {
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      street: updatedUser.street,
      postalCode: updatedUser.postalCode,
      city: updatedUser.city,
      country: updatedUser.country,
    }});
  } catch (e) {
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        email: true,
        name: true,
        avatar: true,
        phone: true,
        street: true,
        postalCode: true,
        city: true,
        country: true,
        admin: true,
      },
    });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json(user);
  } catch (e) {
    console.error('PROFILE GET ERROR:', e);
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
} 