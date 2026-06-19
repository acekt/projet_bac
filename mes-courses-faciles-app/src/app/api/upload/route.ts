import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { verifyJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('mcf_jwt_session')?.value;
    if (!token) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'mes-courses-faciles';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nommé avec un identifiant unique (timestamp + UUID pour éviter l'écrasement)
    const uniqueId = crypto.randomUUID();
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "") // retire l'extension
      .replace(/[^a-zA-Z0-9-_]/g, "_"); // remplace les caractères spéciaux par des underscores
    const publicId = `${cleanFileName}_${Date.now()}_${uniqueId.substring(0, 8)}`;

    // Upload using stream to avoid temporary files
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: folder,
          public_id: publicId,
          overwrite: false
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: (result as any).secure_url }, { status: 200 });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
  }
}
