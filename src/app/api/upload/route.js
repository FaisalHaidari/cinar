import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const data = await req.formData();
  const file = data.get('file');
  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, filename);

  // uploads klasörünün varlığından emin olun
  await import('fs').then(fs => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  await writeFile(filePath, buffer);
  const fileUrl = '/uploads/' + filename;
  return Response.json({ url: fileUrl });
}
