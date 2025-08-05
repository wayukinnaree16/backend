const { supabase } = require('../config/supabase.config'); // ../../config/supabase.config
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Uploads a file buffer to Supabase Storage.
 * @param {Buffer} fileBuffer The file buffer.
 * @param {string} originalname The original name of the file.
 * @param {string} bucketName The name of the Supabase Storage bucket.
 * @param {string} folderPath Optional folder path within the bucket.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
const uploadToSupabaseStorage = async (fileBuffer, originalname, bucketName, folderPath = '') => {
  const fileExtension = path.extname(originalname);
  const fileName = `${folderPath ? folderPath + '/' : ''}${uuidv4()}${fileExtension}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      cacheControl: '3600', // 1 hour
      upsert: false, // Don't overwrite if file exists (uuid should make it unique)
      // contentType: file.mimetype // ควรตั้ง contentType ให้ถูกต้อง
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(`Failed to upload file to Supabase Storage: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    // Even if upload succeeded, if we can't get public URL, it's an issue
    // อาจจะต้องลบไฟล์ที่อัปโหลดไปแล้วถ้า public URL ไม่ได้
    console.error('Failed to get public URL for uploaded file:', fileName);
    throw new Error('File uploaded but failed to retrieve public URL.');
  }

  return publicUrlData.publicUrl;
};

module.exports = {
  uploadToSupabaseStorage,
}; 