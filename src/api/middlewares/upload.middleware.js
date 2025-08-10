const multer = require('multer');
const path = require('path');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

// ตั้งค่า storage (อาจจะเก็บใน memory ก่อนส่งไป Supabase Storage)
const storage = multer.memoryStorage(); // เก็บไฟล์ใน memory buffer

const fileFilter = (req, file, cb) => {
  console.log('File filter - file:', file);
  console.log('File filter - mimetype:', file.mimetype);
  console.log('File filter - originalname:', file.originalname);
  
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    console.log('File filter - accepted');
    return cb(null, true);
  }
  console.log('File filter - rejected');
  cb(new ApiError(httpStatus.BAD_REQUEST, 'Error: File upload only supports the following filetypes - ' + allowedTypes));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: fileFilter,
});

// Middleware สำหรับหลายไฟล์ (เช่น pledge images)
const uploadPledgeImages = upload.array('pledgeImages', 5); // รับ field ชื่อ 'pledgeImages', สูงสุด 5 ไฟล์

// Middleware สำหรับอัพโหลดรูปโปรไฟล์ (single file)
const uploadProfileImage = upload.single('profileImage'); // รับ field ชื่อ 'profileImage'

// Middleware สำหรับอัพโหลดเอกสารมูลนิธิ (single file)
const uploadFoundationDocument = upload.single('documentFile'); // รับ field ชื่อ 'documentFile'

// Middleware สำหรับอัพโหลดรูปภาพทั่วไป (single file)
const uploadGeneralImage = upload.single('logo_file'); // รับ field ชื่อ 'logo_file'

module.exports = {
  uploadPledgeImages,
  uploadProfileImage,
  uploadFoundationDocument,
  uploadGeneralImage,
  // สามารถเพิ่ม single upload middleware อื่นๆ ได้
};