import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { slug, name, phone, password } = await request.json();

    if (!slug || !name || !phone || !password) {
      return NextResponse.json({ message: 'Semua field wajib diisi!' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password minimal 6 karakter!' }, { status: 400 });
    }

    // Cek apakah slug sudah terdaftar
    const existingBySlug = await prisma.client.findUnique({ where: { slug } });
    if (existingBySlug && existingBySlug.password) {
      return NextResponse.json({ message: 'Slug sudah terdaftar!' }, { status: 400 });
    }

    // Cek apakah phone sudah dipakai
    const existingByPhone = await prisma.client.findUnique({ where: { phone } });
    if (existingByPhone) {
      return NextResponse.json({ message: 'Nomor HP sudah terdaftar!' }, { status: 400 });
    }

    // Jika slug sudah ada (pending dari auto-register), update datanya
    if (existingBySlug && !existingBySlug.password) {
      const updated = await prisma.client.update({
        where: { slug },
        data: {
          name,
          phone,
          password,
          status: 'active',
        },
      });
      return NextResponse.json({ message: 'Registrasi berhasil!', clientId: updated.id });
    }

    // Buat client baru
    const client = await prisma.client.create({
      data: {
        name,
        slug,
        phone,
        password,
        googlePlaceId: '',
        status: 'active',
      },
    });

    return NextResponse.json({ message: 'Registrasi berhasil!', clientId: client.id });
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan server!' }, { status: 500 });
  }
}
