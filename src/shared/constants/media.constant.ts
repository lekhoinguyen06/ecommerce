import path from 'path';

export const UPLOAD_PATH = path.resolve('upload');
export const MAX_FILE_ARRAY = 2;
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'] as const;
