# Donation API

API สำหรับแพลตฟอร์มการบริจาค

## การติดตั้ง

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์หลักและเพิ่มค่าต่อไปนี้:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

### 3. เริ่มต้นเซิร์ฟเวอร์
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## การทดสอบ API

### ทดสอบทั้งหมด
```bash
npm test
```

### ทดสอบ Health Check
```bash
npm run test:health
```

### ทดสอบ API Test Endpoint
```bash
npm run test:api
```

### ทดสอบด้วย curl
```bash
# Health check
curl https://backend-lcjt.onrender.comhealth

# API test
curl https://backend-lcjt.onrender.comapi/test

# Public endpoints
curl https://backend-lcjt.onrender.comapi/public/foundations
curl https://backend-lcjt.onrender.comapi/public/item-categories
```

## API Endpoints

ดูรายละเอียด endpoints ทั้งหมดได้ที่ [API_GUIDE.md](./API_GUIDE.md)

### Endpoints หลัก
- `GET /health` - ตรวจสอบสถานะเซิร์ฟเวอร์
- `GET /api/test` - ทดสอบ API
- `GET /api/public/*` - Public endpoints
- `POST /api/auth/*` - Authentication endpoints
- `GET /api/users` - User management
- `GET /api/foundation` - Foundation management
- `GET /api/donor` - Donor management

## โครงสร้างโปรเจค

```
src/
├── api/
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Express middlewares
│   ├── routes/          # Route definitions
│   └── validators/      # Request validation
├── config/              # Configuration files
├── services/            # External services
└── utils/               # Utility functions
```

## การแก้ไขปัญหา

### 404 Error
- ตรวจสอบ URL ที่ถูกต้อง
- ตรวจสอบ HTTP method
- ตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงาน

### 500 Error
- ตรวจสอบ environment variables
- ตรวจสอบการเชื่อมต่อฐานข้อมูล
- ดู error logs ใน console

### CORS Error
- ตรวจสอบ CORS configuration ใน app.js
- ตรวจสอบ origin ที่อนุญาต

## การพัฒนา

### เพิ่ม Route ใหม่
1. สร้าง controller ใน `src/api/controllers/`
2. สร้าง validator ใน `src/api/validators/`
3. เพิ่ม route ใน `src/api/routes/`
4. ลงทะเบียน route ใน `src/api/routes/index.js`

### เพิ่ม Middleware ใหม่
1. สร้าง middleware ใน `src/api/middlewares/`
2. ใช้ใน route หรือ app.js

## License

ISC 