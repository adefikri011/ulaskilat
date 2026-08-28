import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ message: 'Semua field wajib diisi!' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { phone } });

    if (!client || !client.password) {
      return NextResponse.json({ message: 'Akun tidak ditemukan!' }, { status: 404 });
    }

    if (client.password !== password) {
      return NextResponse.json({ message: 'Password salah!' }, { status: 401 });
    }

    // Set cookie sesi merchant
    const response = NextResponse.json({
      message: 'Login berhasil!',
      client: { id: client.id, name: client.name, slug: client.slug },
    });

    response.cookies.set('merchant_auth', client.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan server!' }, { status: 500 });
  }
}
