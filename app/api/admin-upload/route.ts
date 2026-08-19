import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses Storage RLS entirely, so this must ONLY
// ever run server-side, gated by the same x-admin-token check every other
// admin write in this app already uses. SUPABASE_SERVICE_ROLE_KEY must
// never be exposed to the browser (never prefix it with NEXT_PUBLIC_).
function createAdminStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  const path = formData.get('path');
  const bucket = (formData.get('bucket') as string) || 'product-images';

  if (!(file instanceof File) || typeof path !== 'string' || !path) {
    return NextResponse.json({ error: 'file and path are required.' }, { status: 400 });
  }

  try {
    const supabase = createAdminStorageClient();
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, Buffer.from(arrayBuffer), {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ ok: true, data: { publicUrl: data.publicUrl } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Upload failed.' }, { status: 500 });
  }
}