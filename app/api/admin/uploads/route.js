import { dataResponse, errorResponse, requireApiAdmin } from '../../../../lib/admin-api.js';
import { saveUpload } from '../../../../lib/uploads.js';
import { ValidationError } from '../../../../lib/validation.js';

export async function POST(request) {
  const auth = requireApiAdmin(request);
  if (auth.response) return auth.response;
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new ValidationError('An image file is required.', 'INVALID_UPLOAD');
    const saved = await saveUpload(file);
    return dataResponse({ imageUrl: saved.imageUrl, mimeType: saved.mimeType, size: saved.size }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
