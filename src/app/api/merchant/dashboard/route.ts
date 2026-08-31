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
      select: {
        id: true,
        name: true,
        slug: true,
        googlePlaceId: true,
        scanCount: true,
        status: true,
        createdAt: true,
      },
    });

    if (!client) {
      return NextResponse.json({ message: 'Toko tidak ditemukan' }, { status: 404 });
    }

    // Ambil scan logs untuk grafik
    const scanLogs = await prisma.scanLog.findMany({
      where: { clientId: client.id },
      select: { createdAt: true },
    });

    const now = new Date();

    // Data harian 7 hari
    const dailyCounts = Array.from({ length: 7 }).map((_, i) => {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const count = scanLogs.filter((log) => {
        const d = new Date(log.createdAt);
        return d >= dayStart && d < dayEnd;
      }).length;
      return {
        label: dayStart.toLocaleDateString('id-ID', { weekday: 'short' }),
        count,
        isToday: i === 6,
      };
    });

    // Jam tersibuk
    const hourlyData = scanLogs.reduce((acc: number[], log) => {
      const hour = new Date(log.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, Array(24).fill(0));

    const peakHour = hourlyData.indexOf(Math.max(...hourlyData));
    const peakCount = Math.max(...hourlyData);

    return NextResponse.json({
      client,
      dailyCounts,
      hourlyData: { peakHour, peakCount },
    });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
