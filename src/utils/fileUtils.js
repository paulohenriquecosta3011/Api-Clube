// utils/fileUtils.js
import fs from 'fs';
import path from 'path';

/**
 * Remove a file from the uploads folder if it exists.
 * @param {string} filename - The name of the file to be removed
 */
export function removeFile(filename) {
  if (!filename) return;

  const filePath = path.resolve('src', 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) console.error('Error removing file:', err);
    else console.log('File successfully removed:', filename);
  });
}