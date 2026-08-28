import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const isAdmin = cookieHeader.split(';').some((c) => c.trim() === 'admin_auth=true');

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        secretToken: true,
        scanCount: true,
        status: true,
        createdAt: true,
      },
    });

    const allClients = await prisma.client.findMany({
      select: {
        scanLogs: { select: { createdAt: true } },
      },
    });

    const now = new Date();
    const dailyCounts = Array.from({ length: 7 }).map((_, i) => {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      let count = 0;
      allClients.forEach((client) => {
        count += client.scanLogs.filter((log) => {
          const d = new Date(log.createdAt);
          return d >= dayStart && d < dayEnd;
        }).length;
      });

      return {
        label: dayStart.toLocaleDateString('id-ID', { weekday: 'short' }),
        count,
        isToday: i === 6,
      };
    });

    return NextResponse.json({ clients, dailyCounts });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const isAdmin = cookieHeader.split(';').some((c) => c.trim() === 'admin_auth=true');

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ message: 'Nama dan slug wajib diisi!' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');

    const existing = await prisma.client.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ message: 'Slug sudah digunakan!' }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        slug: cleanSlug,
        googlePlaceId: '',
      },
    });

    return NextResponse.json({ message: 'Toko berhasil dibuat!', client });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
