import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const merchantId = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('merchant_auth='))
      ?.split('=')[1];

    if (!merchantId) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }

    const client = await prisma.client.findUnique({ where: { id: merchantId } });
    if (!client) {
      return NextResponse.json({ message: 'Akun tidak ditemukan' }, { status: 404 });
    }

    const { name, slug, googlePlaceId, password } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ message: 'Nama dan slug wajib diisi!' }, { status: 400 });
    }

    // Cek slug unik (kecuali milik sendiri)
    if (slug !== client.slug) {
      const existingSlug = await prisma.client.findUnique({ where: { slug } });
      if (existingSlug) {
        return NextResponse.json({ message: 'Slug sudah digunakan!' }, { status: 400 });
      }
    }

    const updateData: Record<string, string> = {
      name,
      slug,
      googlePlaceId: googlePlaceId || '',
    };

    if (password && password.length >= 6) {
      updateData.password = password;
    }

    const updated = await prisma.client.update({
      where: { id: merchantId },
      data: updateData,
    });

    return NextResponse.json({ message: 'Berhasil disimpan!', slug: updated.slug });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
