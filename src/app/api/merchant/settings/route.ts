import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ message: 'Slug wajib diisi!' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true, googlePlaceId: true },
    });

    if (!client) {
      return NextResponse.json({ message: 'Toko tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { slug, name, googlePlaceId } = await request.json();

    if (!slug || !name) {
      return NextResponse.json({ message: 'Nama wajib diisi!' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { slug } });
    if (!client) {
      return NextResponse.json({ message: 'Toko tidak ditemukan' }, { status: 404 });
    }

    const updated = await prisma.client.update({
      where: { slug },
      data: {
        name,
        googlePlaceId: googlePlaceId || '',
      },
    });

    return NextResponse.json({ message: 'Berhasil disimpan!', slug: updated.slug });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
