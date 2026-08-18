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
    const client = await prisma.client.findUnique({
      where: { slug },
    });

    if (!client) {
      return new NextResponse('Toko tidak ditemukan', { status: 404 });
    }

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

  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}