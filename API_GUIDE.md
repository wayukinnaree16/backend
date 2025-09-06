# คู่มือการใช้งาน API

## Base URL
```
https://backend-lcjt.onrender.com
```

## Endpoints ที่มีอยู่

### 1. Test Endpoints (สำหรับทดสอบ)
- `GET /api/test` - ทดสอบว่า API ทำงานได้
- `GET /health` - ตรวจสอบสถานะของเซิร์ฟเวอร์

### 2. Public Routes (ไม่ต้อง Authentication)
- `GET /api/public/foundations` - ดูข้อมูลมูลนิธิทั้งหมด
- `GET /api/public/item-categories` - ดูหมวดหมู่สินค้า
- `GET /api/public/wishlist-items` - ดูรายการที่ต้องการ
- `GET /api/public/content-pages` - ดูหน้าข้อมูล

### 3. Authentication Routes
- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ (ต้องมี token)
- `POST /api/auth/request-password-reset` - ขอรีเซ็ตรหัสผ่าน
- `POST /api/auth/update-password` - อัปเดตรหัสผ่าน (ต้องมี token)
- `POST /api/auth/forgot-password` - ลืมรหัสผ่าน
- `POST /api/auth/force-reset-password` - บังคับรีเซ็ตรหัสผ่าน

### 4. User Routes (ต้องมี Authentication)
- `GET /api/users` - ดูข้อมูลผู้ใช้
- `PUT /api/users` - อัปเดตข้อมูลผู้ใช้

### 5. Foundation Routes (สำหรับ Admin มูลนิธิ)
- `GET /api/foundation` - ดูข้อมูลมูลนิธิ
- `PUT /api/foundation` - อัปเดตข้อมูลมูลนิธิ

### 6. Donor Routes (สำหรับผู้บริจาค)
- `GET /api/donor` - ดูข้อมูลผู้บริจาค
- `POST /api/donor/pledges` - สร้างคำมั่นสัญญาการบริจาค

### 7. Admin Routes (สำหรับ System Admin)
- `GET /api/admin` - จัดการระบบ

## วิธีการทดสอบ

### 1. ทดสอบว่า API ทำงานได้
```bash
curl https://backend-lcjt.onrender.comapi/test
```

### 2. ทดสอบ Health Check
```bash
curl https://backend-lcjt.onrender.comhealth
```

### 3. ทดสอบ Public Endpoints
```bash
curl https://backend-lcjt.onrender.comapi/public/foundations
curl https://backend-lcjt.onrender.comapi/public/item-categories
```

### 4. ทดสอบ Authentication
```bash
# ลงทะเบียน
curl -X POST https://backend-lcjt.onrender.comapi/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# เข้าสู่ระบบ
curl -X POST https://backend-lcjt.onrender.comapi/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## การแก้ไขปัญหา 404 Error

หากคุณได้รับ 404 Error ให้ตรวจสอบ:

1. **URL ที่ถูกต้อง** - ตรวจสอบว่าใช้ endpoint ที่ถูกต้อง
2. **HTTP Method** - ตรวจสอบว่าใช้ GET, POST, PUT, DELETE ที่ถูกต้อง
3. **Authentication** - บาง endpoints ต้องการ token ใน header
4. **Server กำลังทำงาน** - ตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงานที่ port 3001

## ตัวอย่างการใช้งาน

### ลงทะเบียนผู้ใช้ใหม่
```javascript
fetch('https://backend-lcjt.onrender.comapi/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### เข้าสู่ระบบ
```javascript
fetch('https://backend-lcjt.onrender.comapi/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log(data));
``` 