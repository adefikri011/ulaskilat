import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const merchantId = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('merchant_auth='))
      ?.split('=')[1];

    if (!merchantId) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: merchantId },
      select: { id: true, name: true, slug: true, googlePlaceId: true, scanCount: true },
    });

    if (!client) {
      return NextResponse.json({ message: 'Akun tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
