# คู่มือการทดสอบ API ด้วย Postman (ฉบับครบถ้วน)

---

## 1. ติดตั้งและเตรียม Postman

1. ดาวน์โหลดและติดตั้ง [Postman](https://www.postman.com/downloads/)
2. สมัครสมาชิก (ถ้าต้องการใช้งาน Cloud หรือ Sync)
3. เปิดโปรแกรม Postman

---

## 2. ศึกษา API ที่จะทดสอบ

## รายละเอียดทุก Endpoint ของระบบ (แบบละเอียด)

ด้านล่างนี้คือสรุปทุก endpoint ของ donation-api พร้อมรายละเอียดสำคัญ (method, path, body, header, หมายเหตุ) ตามหมวดหมู่การใช้งาน

---

### 1. Auth (สมัคร, ล็อกอิน, ออกจากระบบ, รีเซ็ตรหัสผ่าน)
| Method | Path | Auth | Body/Query | หมายเหตุ |
|--------|------|------|------------|----------|
| POST | `/api/auth/register` | - | email, password, first_name, last_name, phone_number, profile_image_url, user_type | สมัครสมาชิก |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "email": "user@email.com",
    "password": "รหัสผ่านอย่างน้อย 6 ตัว",
    "first_name": "ชื่อจริง",
    "last_name": "นามสกุล",
    "phone_number": "0812345678",
    "profile_image_url": "https://example.com/profile.jpg",
    "user_type": "donor"
  }
  ``` |
| POST | `/api/auth/login` | - | email, password | ล็อกอิน |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "email": "user@email.com",
    "password": "รหัสผ่าน"
  }
  ``` |
| POST | `/api/auth/logout` | Bearer Token | - | ออกจากระบบ |
| POST | `/api/auth/force-reset-password` | - | email, new_password | **เปลี่ยนรหัสผ่านโดยไม่ต้องยืนยันตัวตน (ไม่ปลอดภัย ใช้สำหรับทดสอบเท่านั้น)** |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "email": "user@email.com",
    "new_password": "รหัสผ่านใหม่"
  }
  ``` |
| | | | **ตัวอย่าง Response** |
| | | | ```json
  {
    "statusCode": 200,
    "message": "Password updated successfully.",
    "success": true
  }
  ``` |

---

### 2. User (ข้อมูลผู้ใช้)
| Method | Path | Auth | Body/Query | หมายเหตุ |
|--------|------|------|------------|----------|
| GET | `/api/users/me` | Bearer Token | - | ดูข้อมูลโปรไฟล์ตัวเอง |
| PUT | `/api/users/me` | Bearer Token | ข้อมูลโปรไฟล์ | แก้ไขโปรไฟล์ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "first_name": "ชื่อใหม่",
    "last_name": "นามสกุลใหม่",
    "phone_number": "0812345678",
    "profile_image_url": "https://example.com/new-image.jpg"
  }
  ``` |
| PUT | `/api/users/me/change-password` | Bearer Token | current_password, new_password | เปลี่ยนรหัสผ่าน |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "current_password": "รหัสผ่านปัจจุบัน",
    "new_password": "รหัสผ่านใหม่อย่างน้อย 6 ตัว"
  }
  ``` |

---

### 3. Public (ข้อมูลสาธารณะ)
| Method | Path | Auth | Body/Query | หมายเหตุ |
|--------|------|------|------------|----------|
| GET | `/api/public/foundations/types` | - | - | ประเภทมูลนิธิทั้งหมด |
| GET | `/api/public/foundations` | - | name, type_id, province, sort_by, page, limit | รายชื่อมูลนิธิ |
| GET | `/api/public/foundations/:foundationId` | - | - | รายละเอียดมูลนิธิ |
| GET | `/api/public/wishlist-items` | - | foundation_id, category_id, status, sort_by, page, limit | รายการสิ่งของที่ต้องการทั้งหมด |
| GET | `/api/public/wishlist-items/:wishlistItemId` | - | - | รายละเอียดสิ่งของที่ต้องการ |
| GET | `/api/public/content-pages/:slug` | - | - | ดูหน้าเนื้อหาสาธารณะ |

---

### 4. Foundation Admin (สำหรับผู้ดูแลมูลนิธิ)
**(ต้องใช้ Bearer Token ของ foundation_admin)**
| Method | Path | Body/Query | หมายเหตุ |
|--------|------|------------|----------|
| GET | `/api/foundation/profile/me` | - | ดูโปรไฟล์มูลนิธิ |
| PUT | `/api/foundation/profile/me` | ข้อมูลโปรไฟล์ | แก้ไขโปรไฟล์มูลนิธิ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "foundation_name": "มูลนิธิเด็กไทย",
    "logo_url": "https://example.com/logo.jpg",
    "history_mission": "ช่วยเหลือเด็กด้อยโอกาส",
    "foundation_type_id": 1,
    "address_line1": "123 ถนนสุขุมวิท",
    "address_line2": "แขวงคลองเตย",
    "city": "กรุงเทพฯ",
    "province": "กรุงเทพมหานคร",
    "postal_code": "10110",
    "country": "Thailand",
    "gmaps_embed_url": "https://maps.google.com/...",
    "contact_phone": "021234567",
    "contact_email": "info@foundation.com",
    "website_url": "https://foundation.com",
    "social_media_links": {
      "facebook": "https://facebook.com/foundation",
      "instagram": "https://instagram.com/foundation"
    },
    "license_number": "123456789",
    "accepts_pickup_service": true,
    "pickup_service_area": "กรุงเทพฯ และปริมณฑล",
    "pickup_contact_info": "โทร 0812345678"
  }
  ``` |
| POST | `/api/foundation/wishlist-items` | title, description, quantity_needed, priority_level, expiry_date, category_id, images | สร้างรายการสิ่งของที่ต้องการ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "item_name": "เสื้อผ้าเด็ก",
    "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L",
    "quantity_unit": "ชิ้น",
    "quantity_needed": 50,
    "priority_level": "high",
    "expiry_date": "2024-12-31",
    "category_id": 1,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }
  ``` |
| GET | `/api/foundation/wishlist-items` | - | ดูรายการสิ่งของที่ต้องการของมูลนิธิ |
| GET | `/api/foundation/wishlist-items/:wishlistItemId` | - | ดูรายละเอียดสิ่งของที่ต้องการ |
| PUT | `/api/foundation/wishlist-items/:wishlistItemId` | ข้อมูลที่ต้องการอัปเดต | อัปเดตรายการสิ่งของที่ต้องการ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "item_name": "เสื้อผ้าเด็ก (อัปเดต)",
    "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L (อัปเดต)",
    "quantity_unit": "ตัว",
    "quantity_needed": 60,
    "priority_level": "medium",
    "expiry_date": "2024-12-31",
    "images": [
      "https://example.com/new-image1.jpg",
      "https://example.com/new-image2.jpg"
    ]
  }
  ``` |
| DELETE | `/api/foundation/wishlist-items/:wishlistItemId` | - | ลบรายการสิ่งของที่ต้องการ |
| GET | `/api/foundation/pledges/received` | - | ดูรายการการบริจาคที่ได้รับ |
| PATCH | `/api/foundation/pledges/:pledgeId/approve` | - | อนุมัติการบริจาค |
| PATCH | `/api/foundation/pledges/:pledgeId/reject` | rejection_reason_by_foundation | ปฏิเสธการบริจาค |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "rejection_reason_by_foundation": "สิ่งของไม่ตรงตามที่ต้องการ"
  }
  ``` |
| PATCH | `/api/foundation/pledges/:pledgeId/confirm-receipt` | - | ยืนยันการรับสิ่งของ |
| POST | `/api/foundation/documents` | document_type, document_url, document_name, expiry_date, description | อัปโหลดเอกสารมูลนิธิ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "document_type": "license",
    "document_url": "https://example.com/document.pdf",
    "document_name": "ใบอนุญาตมูลนิธิ",
    "expiry_date": "2025-12-31",
    "description": "ใบอนุญาตจัดตั้งมูลนิธิ"
  }
  ``` |
| GET | `/api/foundation/documents` | - | ดูรายการเอกสารของมูลนิธิ |
| DELETE | `/api/foundation/documents/:documentId` | - | ลบเอกสาร |

---

### 5. Donor (สำหรับผู้บริจาค)
**(ต้องใช้ Bearer Token ของ donor)**
| Method | Path | Body/Query | หมายเหตุ |
|--------|------|------------|----------|
| POST | `/api/donor/pledges` | wishlist_item_id, quantity_pledged, donor_item_description, delivery_method, courier_company_name, tracking_number, pickup_address_details, pickup_preferred_datetime | สร้างการบริจาค |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "wishlist_item_id": 1,
    "quantity_pledged": 10,
    "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
    "delivery_method": "courier_service",
    "courier_company_name": "Kerry Express",
    "tracking_number": "KRY123456789",
    "pickup_address_details": "123 ถนนสุขุมวิท กรุงเทพฯ",
    "pickup_preferred_datetime": "2024-01-15T10:00:00Z"
  }
  ``` |
| GET | `/api/donor/pledges` | - | ดูรายการการบริจาคของตัวเอง |
| GET | `/api/donor/pledges/:pledgeId` | - | ดูรายละเอียดการบริจาค |
| POST | `/api/donor/favorites` | foundation_id | เพิ่มมูลนิธิที่ชื่นชอบ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "foundation_id": 1
  }
  ``` |
| GET | `/api/donor/favorites` | - | ดูรายการมูลนิธิที่ชื่นชอบ |
| DELETE | `/api/donor/favorites/:foundationId` | - | ลบมูลนิธิที่ชื่นชอบ |
| POST | `/api/donor/pledges/:pledgeId/reviews` | rating, review_text, anonymous | ส่งรีวิวสำหรับการบริจาค |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "rating": 5,
    "review_text": "มูลนิธิให้บริการดีมาก รับสิ่งของอย่างเป็นมิตร",
    "anonymous": false
  }
  ``` |

---

### 6. Admin (สำหรับแอดมินระบบ)
**(ต้องใช้ Bearer Token ของ system_admin)**
| Method | Path | Body/Query | หมายเหตุ |
|--------|------|------------|----------|
| GET | `/api/admin/users` | page, limit | รายชื่อผู้ใช้ทั้งหมด |
| GET | `/api/admin/users/:userId` | - | ดูรายละเอียดผู้ใช้ |
| PATCH | `/api/admin/users/:userId/ban` | ban_reason | แบนผู้ใช้ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "ban_reason": "ละเมิดข้อตกลงการใช้งาน"
  }
  ``` |
| PATCH | `/api/admin/users/:userId/unban` | - | ปลดแบนผู้ใช้ |
| GET | `/api/admin/foundations` | page, limit | รายชื่อมูลนิธิทั้งหมด |
| GET | `/api/admin/foundations/:foundationId` | - | ดูรายละเอียดมูลนิธิ |
| PATCH | `/api/admin/foundations/:foundationId/approve-account` | - | อนุมัติบัญชีมูลนิธิ |
| PATCH | `/api/admin/foundations/:foundationId/reject-account` | rejection_reason, admin_notes | ปฏิเสธบัญชีมูลนิธิ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "rejection_reason": "เอกสารไม่ครบถ้วน",
    "admin_notes": "กรุณาส่งเอกสารเพิ่มเติม"
  }
  ``` |
| GET | `/api/admin/foundations/:foundationId/documents` | - | ดูเอกสารของมูลนิธิ |
| PATCH | `/api/admin/foundations/documents/:documentId/review` | review_status, admin_notes | ตรวจสอบเอกสารมูลนิธิ |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "review_status": "approved",
    "admin_notes": "เอกสารถูกต้องครบถ้วน"
  }
  ``` |
| GET | `/api/admin/content-pages` | - | รายการหน้าเนื้อหา |
| POST | `/api/admin/content-pages` | title, content, meta_description | สร้างหน้าเนื้อหา |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "title": "เกี่ยวกับเรา",
    "content": "<h1>เกี่ยวกับเรา</h1><p>รายละเอียด...</p>",
    "meta_description": "ข้อมูลเกี่ยวกับระบบบริจาค"
  }
  ``` |
| GET | `/api/admin/content-pages/:pageIdOrSlug` | - | ดูรายละเอียดหน้าเนื้อหา |
| PUT | `/api/admin/content-pages/:pageIdOrSlug` | title, content, meta_description | อัปเดตหน้าเนื้อหา |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "title": "เกี่ยวกับเรา (อัปเดต)",
    "content": "<h1>เกี่ยวกับเรา</h1><p>เนื้อหาใหม่...</p>",
    "meta_description": "ข้อมูลใหม่เกี่ยวกับระบบบริจาค"
  }
  ``` |
| DELETE | `/api/admin/content-pages/:pageIdOrSlug` | - | ลบหน้าเนื้อหา |
| GET | `/api/admin/reviews/pending-approval` | page, limit | รายการรีวิวที่รออนุมัติ |
| PATCH | `/api/admin/reviews/:reviewId/approve` | admin_review_remarks | อนุมัติรีวิว |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "admin_review_remarks": "รีวิวเหมาะสม"
  }
  ``` |
| PATCH | `/api/admin/reviews/:reviewId/reject` | admin_review_remarks | ปฏิเสธรีวิว |
| | | | **ตัวอย่าง Body** |
| | | | ```json
  {
    "admin_review_remarks": "รีวิวไม่เหมาะสม ใช้คำที่ไม่สุภาพ"
  }
  ``` |

---

### 7. Shared (ฟีเจอร์ที่ใช้ร่วมกัน)
| Method | Path | Auth | หมายเหตุ |
|--------|------|------|----------|
| GET | `/api/notifications` | Bearer Token | รายการการแจ้งเตือนของตัวเอง |
| GET | `/api/messages` | Bearer Token | รายการข้อความของตัวเอง |
| POST | `/api/upload/image` | Bearer Token | อัพโหลดรูปภาพทั่วไป |

---

**หมายเหตุ**  
- ทุก endpoint ที่ต้องการ Auth ต้องส่ง Header: `Authorization: Bearer <token>`
- ทุก request ที่มี body ต้องส่ง Header: `Content-Type: application/json`
- สามารถดูตัวอย่าง body/response ได้ในไฟล์ `คู่มือการใช้API.md` ที่แนบมาในโปรเจกต์

---

## 3. สร้าง Request ใหม่

1. กด **New** > **HTTP Request**
2. เลือก Method (GET, POST, PUT, PATCH, DELETE)
3. ใส่ URL ของ API

---

## 4. กำหนด Headers

1. กดแท็บ **Headers**
2. เพิ่ม Key-Value ตามที่ API ต้องการ เช่น
   - `Content-Type: application/json`
   - `Authorization: Bearer <token>`
   - อื่น ๆ ตามที่ API ระบุ

---

## 5. กำหนด Body (สำหรับ POST, PUT, PATCH)

1. กดแท็บ **Body**
2. เลือก `raw` และเลือก `JSON` (หรือรูปแบบอื่นที่ API รองรับ)
3. ใส่ข้อมูล JSON ตัวอย่าง เช่น
   ```json
   {
     "name": "John",
     "email": "john@example.com"
   }
   ```

---

## 6. ส่ง Request

1. กดปุ่ม **Send**
2. ดูผลลัพธ์ที่แท็บ **Response**
   - Status Code (เช่น 200, 201, 400, 401, 404, 500)
   - Response Body (ข้อมูลที่ API ส่งกลับมา)
   - Response Headers

---

## 7. ตัวอย่างการทดสอบแต่ละ Method

### 7.1 GET

- Method: GET  
- URL: `https://api.example.com/users`
- Headers: (ถ้ามี)
- Body: ไม่ต้องใส่

### 7.2 POST

- Method: POST  
- URL: `https://api.example.com/users`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "name": "John",
    "email": "john@example.com"
  }
  ```

### 7.3 PUT

- Method: PUT  
- URL: `https://api.example.com/users/1`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "name": "John Updated"
  }
  ```

### 7.4 PATCH

- Method: PATCH  
- URL: `https://api.example.com/users/1`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "email": "john.new@example.com"
  }
  ```

### 7.5 DELETE

- Method: DELETE  
- URL: `https://api.example.com/users/1`
- Headers: (ถ้ามี)
- Body: ไม่ต้องใส่

---

## 8. การใช้ Environment และตัวแปร

1. สร้าง Environment (เช่น Dev, Staging, Production)
2. เพิ่มตัวแปร เช่น `base_url`, `token`
3. ใช้ตัวแปรใน URL หรือ Headers เช่น  
   - `{{base_url}}/users`
   - `Authorization: Bearer {{token}}`

---

## 9. การจัดกลุ่ม Collection

1. สร้าง Collection เพื่อจัดกลุ่ม API ที่เกี่ยวข้อง
2. เพิ่ม Request ต่าง ๆ ลงใน Collection
3. สามารถ Export/Import Collection เพื่อแชร์กับทีมได้

---

## 10. การเขียน Test Script

1. ที่แท็บ **Tests** สามารถเขียน JavaScript เพื่อตรวจสอบผลลัพธ์อัตโนมัติ เช่น
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });
   pm.test("Response has id", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData).to.have.property("id");
   });
   ```

---

## 11. การใช้งาน Pre-request Script

1. ที่แท็บ **Pre-request Script** สามารถเขียน JavaScript เพื่อเตรียมข้อมูลก่อนส่ง Request เช่น สร้าง Token, สุ่มข้อมูล ฯลฯ

---

## 12. การใช้งาน Runner

1. กดปุ่ม **Runner** (หรือ Collection Runner)
2. เลือก Collection ที่ต้องการรัน
3. ใส่ Environment (ถ้ามี)
4. กด **Run** เพื่อรัน API หลายตัวต่อเนื่อง

---

## 13. การใช้งาน Monitor

1. สร้าง Monitor เพื่อรัน Collection ตามเวลาที่กำหนด (เช่น ทุกชั่วโมง ทุกวัน)
2. ใช้สำหรับตรวจสอบ API อัตโนมัติ

---

## 14. การ Export/Import Collection

1. คลิกขวาที่ Collection > Export เพื่อบันทึกไฟล์ .json
2. นำไฟล์ .json ไป Import ในเครื่องอื่นหรือแชร์กับทีม

---

## 15. การดูและจัดการประวัติ (History)

1. ที่แถบ **History** จะเก็บ Request ที่เคยส่ง
2. สามารถคลิกดูรายละเอียดหรือบันทึกลง Collection ได้

---

## 16. การใช้งานอื่น ๆ ที่สำคัญ

- **Mock Server**: สร้าง Mock API สำหรับทดสอบ
- **API Documentation**: สร้างเอกสาร API อัตโนมัติจาก Collection
- **Integration กับ CI/CD**: ใช้ Newman (CLI ของ Postman) สำหรับรัน Collection ใน Pipeline

---

# สรุปขั้นตอน (Flowchart)

1. ศึกษา API → 2. สร้าง Request → 3. ใส่ URL/Method → 4. ใส่ Header/Body → 5. ส่ง Request → 6. ดูผลลัพธ์ → 7. เขียน Test Script → 8. จัดกลุ่ม Collection → 9. แชร์/Export → 10. ใช้งานขั้นสูง (Environment, Runner, Monitor, Mock, Doc, CI/CD)

---

**หมายเหตุ:**  
- ทุกขั้นตอนข้างต้นเป็นมาตรฐานการทดสอบ API ด้วย Postman ที่ครบถ้วน
- สามารถนำไปประยุกต์ใช้กับ API ทุกประเภท  
- หากต้องการตัวอย่าง Collection หรือ Script เพิ่มเติม แจ้งรายละเอียดได้เลยครับ

---

**คู่มือนี้ครบถ้วน ห้ามขาดห้ามเกิน**
หากต้องการเวอร์ชัน PDF หรือไฟล์ตัวอย่าง แจ้งได้เลย!

---

## 17. การอัพโหลดไฟล์/รูปภาพ

### API ที่รองรับการอัพโหลดไฟล์:

#### 1. อัพโหลดรูปภาพทั่วไป
```http
POST /api/upload/image
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

Form Data:
- image: [ไฟล์รูปภาพ] (jpeg, jpg, png, gif, สูงสุด 5MB)
```

#### 2. อัพเดตรูปโปรไฟล์
```http
PUT /api/users/me
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

Form Data:
- profileImage: [ไฟล์รูปภาพ] (jpeg, jpg, png, gif, สูงสุด 5MB)
- first_name: "ชื่อ"
- last_name: "นามสกุล"
- phone_number: "เบอร์โทร"
```

#### 3. อัพโหลดเอกสารมูลนิธิ
```http
POST /api/foundation/documents
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

Form Data:
- documentFile: [ไฟล์เอกสาร] (jpeg, jpg, png, gif, pdf, สูงสุด 5MB)
- document_name: "ชื่อเอกสาร"
```

#### 4. สร้าง Pledge พร้อมรูปภาพ
```http
POST /api/donor/pledges
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

Form Data:
- pledgeImages: [ไฟล์รูปภาพ] (สูงสุด 5 ไฟล์, ไฟล์ละ 5MB)
- wishlist_item_id: 1
- quantity: 5
- estimated_delivery_date: "2024-12-31"
- delivery_address: "ที่อยู่จัดส่ง"
- special_instructions: "คำแนะนำพิเศษ"
```

### หมายเหตุ:
- **รองรับไฟล์**: jpeg, jpg, png, gif
- **ขนาดไฟล์**: สูงสุด 5MB ต่อไฟล์
- **จำนวนไฟล์**: สูงสุด 5 ไฟล์ต่อครั้ง (สำหรับ pledge images)
- **การจัดเก็บ**: ไฟล์จะถูกอัพโหลดไป Supabase Storage
- **URL ที่ได้**: จะเป็น public URL ที่สามารถเข้าถึงได้ทันที 