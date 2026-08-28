import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { slug, name, googlePlaceId } = await request.json();

    if (!slug || !name || !googlePlaceId) {
      return NextResponse.json({ message: 'Semua field wajib diisi!' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { slug } });

    if (!client) {
      return NextResponse.json({ message: 'Toko tidak ditemukan!' }, { status: 404 });
    }

    // Update data toko
    const updated = await prisma.client.update({
      where: { slug },
      data: {
        name,
        googlePlaceId,
        status: 'active',
      },
    });

    return NextResponse.json({
      message: 'Toko berhasil didaftarkan!',
      client: { id: updated.id, name: updated.name, slug: updated.slug },
    });
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan server!' }, { status: 500 });
  }
}
