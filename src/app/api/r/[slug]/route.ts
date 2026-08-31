// src/app/api/r/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    let client = await prisma.client.findUnique({
      where: { slug },
    });

    // Auto-register: jika slug belum ada, buat client baru (pending)
    if (!client) {
      client = await prisma.client.create({
        data: {
          name: slug,
          slug,
          googlePlaceId: '',
        },
      });
      return NextResponse.redirect(new URL(`/merchant/dashboard?slug=${slug}`, request.url));
    }

    // Jika client belum isi Google Place ID, arahkan ke dashboard untuk setup
    if (!client.googlePlaceId) {
      return NextResponse.redirect(new URL(`/merchant/dashboard?slug=${slug}`, request.url));
    }

    // Client sudah aktif, lanjut scan + redirect ke landing page
    await prisma.client.update({
      where: { id: client.id },
      data: {
        scanCount: { increment: 1 },
        scanLogs: {
          create: {}, 
        },
      },
    });

    return NextResponse.redirect(new URL(`/store/${slug}`, request.url));

  } catch {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}