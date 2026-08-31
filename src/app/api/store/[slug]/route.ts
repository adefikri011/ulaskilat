import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const client = await prisma.client.findUnique({
      where: { slug },
      select: { name: true, slug: true, googlePlaceId: true, status: true },
    });

    if (!client) {
      return NextResponse.json({ message: 'Toko tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      store: {
        name: client.name,
        slug: client.slug,
        googlePlaceId: client.googlePlaceId,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
