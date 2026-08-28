// src/app/api/r/[slug]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      // Redirect ke halaman registrasi untuk melengkapi data
      return NextResponse.redirect(new URL(`/register?slug=${slug}`, request.url));
    }

    // Jika client belum punya password, arahkan ke registrasi
    if (!client.password) {
      return NextResponse.redirect(new URL(`/register?slug=${slug}`, request.url));
    }

    // Client sudah terdaftar, lanjut scan + redirect ke Google Maps
    await prisma.client.update({
      where: { id: client.id },
      data: {
        scanCount: { increment: 1 },
        scanLogs: {
          create: {}, 
        },
      },
    });

    const googleMapsUrl = `https://search.google.com/local/writereview?placeid=${client.googlePlaceId}`;
    return NextResponse.redirect(googleMapsUrl);

  } catch {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}