# ผลการทดสอบ API ด้วย Postman

---

## สรุปผลการทดสอบ

- วันที่ทดสอบ: ........................................
- ผู้ทดสอบ: ...........................................
- เวอร์ชัน API: .......................................
- Environment: [Dev / Staging / Production]

---

## ตารางผลการทดสอบ

| ลำดับ | Endpoint | Method | ผลลัพธ์ที่คาดหวัง | ผลลัพธ์ที่ได้ | Status | หมายเหตุ |
|-------|----------|--------|-------------------|---------------|--------|----------|
| 1 | /api/auth/register | POST | สมัครสำเร็จ (201) | สมัครสำเร็จ (201) | ✅ | - |
| 2 | /api/auth/login | POST | ล็อกอินสำเร็จ (200) | ล็อกอินสำเร็จ (200) | ✅ | - |
| 3 | /api/users/me | GET | ได้ข้อมูลผู้ใช้ (200) | ได้ข้อมูลผู้ใช้ (200) | ✅ | - |
| 4 | /api/auth/logout | POST | ออกจากระบบสำเร็จ (200) | ออกจากระบบสำเร็จ (200) | ✅ | - |
| 5 | /api/auth/force-reset-password | POST | เปลี่ยนรหัสผ่านสำเร็จ (200) | เปลี่ยนรหัสผ่านสำเร็จ (200) | ✅ | - |
| 6 | /api/users/me | PUT | แก้ไขโปรไฟล์ตัวเองสำเร็จ (200) | แก้ไขโปรไฟล์ตัวเองสำเร็จ (200) | ✅ | - |
| 7 | /api/users/me/change-password | PUT | เปลี่ยนรหัสผ่านสำเร็จ (200) | เปลี่ยนรหัสผ่านสำเร็จ (200) | ✅ | - |
| 8 | /api/public/foundations/types | GET | ได้ข้อมูลประเภทมูลนิธิทั้งหมด (200) | ได้ข้อมูลประเภทมูลนิธิทั้งหมด (200) | ✅ | - |
| 9 | /api/public/foundations | GET | ได้ข้อมูลมูลนิธิทั้งหมด (200) | ได้ข้อมูลมูลนิธิทั้งหมด (200) | ✅ | - |
| 10 | /api/public/foundations/2 | GET | ได้ข้อมูลมูลนิธิที่รายละเอียด (200) | ได้ข้อมูลมูลนิธิที่รายละเอียด (200) | ✅ | - |
| 11 | /api/foundation/profile/me | GET | ได้ข้อความแจ้งว่า Foundation profile not yet created (200) | Foundation profile not yet created (200) | ✅ | - |
| 12 | /api/foundation/profile/me | PUT | สร้างหรืออัปเดตโปรไฟล์มูลนิธิสำเร็จ (200) | สร้างหรืออัปเดตโปรไฟล์มูลนิธิสำเร็จ (200) | ✅ | - |
| 13 | /api/foundation/wishlist-items | POST | สร้าง wishlist item สำเร็จ (201) | สร้าง wishlist item สำเร็จ (201) | ✅ | - |
| 14 | /api/public/wishlist-items/6 | GET | ดู wishlist item แบบ public สำเร็จ (200) | ดู wishlist item แบบ public สำเร็จ (200) | ✅ | - |
| 15 | /api/foundation/wishlist-items | GET | ดึงรายการ wishlist ของ foundation สำเร็จ (200) | ดึงรายการ wishlist ของ foundation สำเร็จ (200) | ✅ | - |
| 16 | /api/foundation/wishlist-items/6 | GET | ดูรายละเอียด wishlist item ของ foundation สำเร็จ (200) | ดูรายละเอียด wishlist item ของ foundation สำเร็จ (200) | ✅ | - |
| 17 | /api/foundation/wishlist-items/6 | PUT | อัปเดตรายการ wishlist item สำเร็จ (200) | อัปเดตรายการ wishlist item สำเร็จ (200) | ✅ | - |
| 18 | /api/foundation/wishlist-items/7 | DELETE | ลบ wishlist item สำเร็จ (200) | ลบ wishlist item สำเร็จ (200) | ✅ | - |
| 19 | /api/foundation/pledges/received | GET | ไม่มีรายการ pledge ที่ได้รับ (200) | ไม่มีรายการ pledge ที่ได้รับ (200) | ✅ | - |
| 20 | /api/foundation/documents | POST | อัปโหลดเอกสารมูลนิธิสำเร็จ (201) | อัปโหลดเอกสารมูลนิธิสำเร็จ (201) | ✅ | - |
| 21 | /api/foundation/documents | GET | ดึงเอกสารมูลนิธิสำเร็จ (200) | ดึงเอกสารมูลนิธิสำเร็จ (200) | ✅ | - |
| 22 | /api/foundation/documents/1 | DELETE | ลบเอกสารมูลนิธิสำเร็จ (200) | ลบเอกสารมูลนิธิสำเร็จ (200) | ✅ | - |
| 23 | /api/donor/pledges | POST | สร้าง pledge สำเร็จ (201) | สร้าง pledge สำเร็จ (201) | ✅ | - |
| 24 | /api/donor/pledges | GET | ดึงรายการ pledge ของ donor สำเร็จ (200) | ดึงรายการ pledge ของ donor สำเร็จ (200) | ✅ | - |
| 25 | /api/donor/pledges/1 | GET | ดูรายละเอียด pledge สำเร็จ (200) | ดูรายละเอียด pledge สำเร็จ (200) | ✅ | - |
| 26 | /api/foundation/pledges/received | GET | ดูรายการ pledge ที่ foundation ได้รับสำเร็จ (200) | ดูรายการ pledge ที่ foundation ได้รับสำเร็จ (200) | ✅ | - |
| 27 | /api/foundation/pledges/1/approve | PATCH | อนุมัติ pledge สำเร็จ (200) | อนุมัติ pledge สำเร็จ (200) | ✅ | - |
| 28 | /api/foundation/pledges/1/reject | PATCH | ปฏิเสธ pledge สำเร็จ (200) | ปฏิเสธ pledge สำเร็จ (200) | ✅ | - |
| 29 | /api/foundation/pledges/1/confirm-receipt | PATCH | ยืนยันรับของสำเร็จ (200) | ยืนยันรับของสำเร็จ (200) | ✅ | - |
| 30 | /api/donor/favorites | POST | เพิ่ม foundation เข้ารายการโปรดสำเร็จ (201) | เพิ่ม foundation เข้ารายการโปรดสำเร็จ (201) | ✅ | - |
| 31 | /api/donor/favorites | GET | ดึงรายการ foundation ที่ favorite สำเร็จ (200) | ดึงรายการ foundation ที่ favorite สำเร็จ (200) | ✅ | - |
| 32 | /api/donor/favorites/2 | DELETE | ลบ foundation ออกจากรายการโปรดสำเร็จ (200) | ลบ foundation ออกจากรายการโปรดสำเร็จ (200) | ✅ | - |
| 33 | /api/donor/pledges/1/reviews | POST | ส่งรีวิวสำหรับการบริจาคสำเร็จ (201) | ส่งรีวิวสำหรับการบริจาคสำเร็จ (201) | ✅ | - |
| 34 | /api/admin/users | GET | ดึงรายชื่อผู้ใช้ทั้งหมดสำเร็จ (200) | ดึงรายชื่อผู้ใช้ทั้งหมดสำเร็จ (200) | ✅ | - |
| 35 | /api/admin/users/{user_id} | GET | ดึงรายละเอียดผู้ใช้รายคนสำเร็จ (200) | ดึงรายละเอียดผู้ใช้รายคนสำเร็จ (200) | ✅ | - |
| 36 | /api/admin/users/{user_id}/ban | PATCH | แบนผู้ใช้สำเร็จ (200) | แบนผู้ใช้สำเร็จ (200) | ✅ | - |
| 37 | /api/admin/users/{user_id}/unban | PATCH | ยกเลิกการแบนผู้ใช้สำเร็จ (200) | ยกเลิกการแบนผู้ใช้สำเร็จ (200) | ✅ | - |
| 38 | /api/admin/foundations | GET | ดึงรายชื่อมูลนิธิทั้งหมดสำเร็จ (200) | ดึงรายชื่อมูลนิธิทั้งหมดสำเร็จ (200) | ✅ | - |
| 39 | /api/admin/foundations/{foundation_id} | GET | ดึงรายละเอียดมูลนิธิที่รายละเอียด (200) | ดึงรายละเอียดมูลนิธิที่รายละเอียด (200) | ✅ | - |
| 40. PATCH /api/admin/foundations/{foundation_id}/approve-account | PATCH | อนุมัติบัญชีมูลนิธิสำเร็จ (200) | อนุมัติบัญชีมูลนิธิสำเร็จ (200) | ✅ | - |
| 41. PATCH /api/admin/users/{user_id}/reset-status | PATCH | รีเซ็ตสถานะผู้ใช้สำเร็จ (200) | รีเซ็ตสถานะผู้ใช้สำเร็จ (200) | ✅ | - |
| 42. PATCH /api/admin/foundations/{foundation_id}/reject-account | PATCH | ปฏิเสธบัญชีมูลนิธิสำเร็จ (200) | ปฏิเสธบัญชีมูลนิธิสำเร็จ (200) | ✅ | - |
| 43. GET /api/admin/foundations/{foundation_id}/documents | GET | ดึงเอกสารมูลนิธิสำเร็จ (200) | ดึงเอกสารมูลนิธิสำเร็จ (200) | ✅ | - |
| 44. PATCH /api/admin/foundations/documents/{documentId}/review | PATCH | อนุมัติหรือปฏิเสธเอกสารมูลนิธิสำเร็จ (200) | อนุมัติหรือปฏิเสธเอกสารมูลนิธิสำเร็จ (200) | ✅ | - |
| 45. GET /api/admin/content-pages | GET | ดึงรายชื่อหน้าเนื้อหาสำเร็จ (200) | ดึงรายชื่อหน้าเนื้อหาสำเร็จ (200) | ✅ | - |
| 46. POST /api/admin/content-pages | POST | สร้าง content page พร้อม meta_description สำเร็จ (201) | สร้าง content page พร้อม meta_description สำเร็จ (201) | ✅ | - |
| 47 | /api/public/content-pages/1 | GET | ดึงข้อมูลหน้าเนื้อหาสาธารณะสำเร็จ (200) | ดึงข้อมูลหน้าเนื้อหาสาธารณะสำเร็จ (200) | ✅ | - |
| 48 | /api/admin/content-pages/1 | GET | ดึงข้อมูลหน้าเนื้อหาแอดมินสำเร็จ (200) | ดึงข้อมูลหน้าเนื้อหาแอดมินสำเร็จ (200) | ✅ | - |
| 49 | /api/admin/content-pages/1 | PUT | อัปเดตข้อมูลหน้าเนื้อหาแอดมินสำเร็จ (200) | อัปเดตข้อมูลหน้าเนื้อหาแอดมินสำเร็จ (200) | ✅ | - |
| 50 | /api/notifications | GET | ดึงรายการการแจ้งเตือนสำเร็จ (200) | ดึงรายการการแจ้งเตือนสำเร็จ (200) | ✅ | - |
| 51 | /api/upload/image | POST | อัพโหลดรูปภาพทั่วไปสำเร็จ (200) | อัพโหลดรูปภาพทั่วไปสำเร็จ (200) | ✅ | - |
| ... | ... | ... | ... | ... | ... | ... |

---

## ตัวอย่าง Response ที่ได้จากแต่ละ Endpoint

### 1. POST /api/auth/register
**Request Body:**
```json
{
    "email": "user1@email.com",
    "password": "user123",
    "first_name": "wa",
    "last_name": "yu",
    "phone_number": "0812345678",
    "profile_image_url": "https://example.com/profile.jpg",
    "user_type": "donor"
}
```
**Response:**
```json
{
    "statusCode": 201,
    "data": {
        "user": {
            "user_id": 9,
            "email": "user1@email.com",
            "first_name": "wa",
            "last_name": "yu",
            "phone_number": "0812345678",
            "profile_image_url": "https://example.com/profile.jpg",
            "user_type": "donor",
            "is_email_verified": false,
            "account_status": "active",
            "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
            "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
            "created_at": "2025-06-30T08:18:39.081355+00:00",
            "updated_at": "2025-06-30T08:18:39.081355+00:00",
            "last_login_at": null
        }
    },
    "message": "Registration successful.",
    "success": true
}
```

### 2. POST /api/auth/login
**Request Body:**
```json
{
    "email": "user1@email.com",
    "password": "user123"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "user": {
            "user_id": 9,
            "email": "user1@email.com",
            "first_name": "wa",
            "last_name": "yu",
            "phone_number": "0812345678",
            "profile_image_url": "https://example.com/profile.jpg",
            "user_type": "donor",
            "is_email_verified": false,
            "account_status": "active",
            "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
            "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
            "created_at": "2025-06-30T08:18:39.081355+00:00",
            "updated_at": "2025-06-30T08:18:39.081355+00:00",
            "last_login_at": null
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJlbWFpbCI6InVzZXIxQGVtYWlsLmNvbSIsInVzZXJfdHlwZSI6ImRvbm9yIiwiaWF0IjoxNzUxMjcyMTg5LCJleHAiOjE3NTEzNTg1ODl9.tjdjAsFAVtsq7NFnSzqExC3tT3Z3SlqdvHWToAecA4U"
    },
    "message": "Login successful",
    "success": true
}
```

### 3. GET /api/users/me
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "user_id": 9,
        "email": "user1@email.com",
        "first_name": "wa",
        "last_name": "yu",
        "phone_number": "0812345678",
        "profile_image_url": "https://example.com/profile.jpg",
        "user_type": "donor",
        "is_email_verified": false,
        "account_status": "active",
        "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
        "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
        "created_at": "2025-06-30T08:18:39.081355+00:00",
        "updated_at": "2025-06-30T08:59:17.80722+00:00",
        "last_login_at": "2025-06-30T08:29:49.189+00:00"
    },
    "message": "User profile retrieved successfully",
    "success": true
}
```

### 4. POST /api/auth/logout
**Response:**
```json
{
    "statusCode": 200,
    "data": null,
    "message": "Logout successful",
    "success": true
}
```

### 5. POST /api/auth/force-reset-password
**Request Body:**
```json
{
    "email": "user1@email.com",
    "new_password": "user456"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "message": "Password updated successfully.",
    "success": true
}
```

### 6. PUT /api/users/me
**Request Body:**
```json
{
    "first_name": "ball",
    "last_name": "ni",
    "phone_number": "0812345678",
    "profile_image_url": "https://example.com/new-image.jpg"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "user": {
            "user_id": 9,
            "email": "user1@email.com",
            "first_name": "ball",
            "last_name": "ni",
            "phone_number": "0812345678",
            "profile_image_url": "https://example.com/new-image.jpg",
            "user_type": "donor",
            "is_email_verified": false,
            "account_status": "active",
            "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
            "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
            "created_at": "2025-06-30T08:18:39.081355+00:00",
            "updated_at": "2025-06-30T09:14:09.167183+00:00",
            "last_login_at": "2025-06-30T08:29:49.189+00:00"
        }
    },
    "message": "Profile updated successfully",
    "success": true
}
```

### 7. PUT /api/users/me/change-password
**Request Body:**
```json
{
    "current_password": "user456",
    "new_password": "user789"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": null,
    "message": "Password changed successfully",
    "success": true
}
```

### 8. GET /api/public/foundations/types
**Response:**
```json
{
    "statusCode": 200,
    "data": [
        {
            "type_id": 8,
            "name": "มูลนิธิเพื่อการกุศลทั่วไป",
            "description": "มูลนิธิที่ดำเนินกิจกรรมการกุศลในรูปแบบทั่วไป"
        },
        {
            "type_id": 2,
            "name": "มูลนิธิเพื่อการแพทย์และสาธารณสุข",
            "description": "มูลนิธิที่มุ่งเน้นการส่งเสริมสุขภาพและการแพทย์"
        },
        {
            "type_id": 1,
            "name": "มูลนิธิเพื่อการศึกษา",
            "description": "มูลนิธิที่มุ่งเน้นการส่งเสริมและพัฒนาการศึกษา"
        },
        {
            "type_id": 3,
            "name": "มูลนิธิเพื่อเด็กและเยาวชน",
            "description": "มูลนิธิที่มุ่งเน้นการพัฒนาและช่วยเหลือเด็กและเยาวชน"
        },
        {
            "type_id": 7,
            "name": "มูลนิธิเพื่อผู้ด้อยโอกาส",
            "description": "มูลนิธิที่มุ่งเน้นการช่วยเหลือผู้ด้อยโอกาสในสังคม"
        },
        {
            "type_id": 4,
            "name": "มูลนิธิเพื่อผู้สูงอายุ",
            "description": "มูลนิธิที่มุ่งเน้นการช่วยเหลือและดูแลผู้สูงอายุ"
        },
        {
            "type_id": 6,
            "name": "มูลนิธิเพื่อสัตว์",
            "description": "มูลนิธิที่มุ่งเน้นการช่วยเหลือและคุ้มครองสัตว์"
        },
        {
            "type_id": 5,
            "name": "มูลนิธิเพื่อสิ่งแวดล้อม",
            "description": "มูลนิธิที่มุ่งเน้นการอนุรักษ์และพัฒนาสิ่งแวดล้อม"
        }
    ],
    "message": "Foundation types listed successfully",
    "success": true
}
```

### 9. GET /api/public/foundations
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "foundations": [
            {
                "foundation_id": 2,
                "foundation_name": "มูลนิธิใจดี เทสต์",
                "logo_url": "https://example.com/logo.png",
                "city": "กรุงเทพมหานคร",
                "province": "กรุงเทพมหานคร",
                "verified_at": "2025-06-07T09:06:29.935+00:00",
                "foundation_type": {
                    "type_id": 2,
                    "name": "มูลนิธิเพื่อการแพทย์และสาธารณสุข"
                },
                "history_mission": "ประวัติและความมุ่งมั่นของมูลนิธิใจดี...",
                "foundation_type_id": 2,
                "address_line1": "123 ถนนสุขุมวิท",
                "address_line2": null,
                "postal_code": "10110",
                "country": "Thailand",
                "gmaps_embed_url": null,
                "contact_phone": null,
                "contact_email": "contact@jaidee.org",
                "website_url": "https://jaidee.org",
                "social_media_links": {
                    "twitter": "https://twitter.com/lovelypetstest",
                    "facebook": "https://facebook.com/lovelypetstest",
                    "instagram": "https://instagram.com/lovelypetstest"
                },
                "license_number": "LIC-001",
                "accepts_pickup_service": true,
                "pickup_service_area": "ในเขตกรุงเทพฯ และปริมณฑล",
                "pickup_contact_info": "ติดต่อคุณสมชาย 080-123-4567",
                "verified_by_admin_id": 1,
                "verification_notes": null,
                "created_at": "2025-06-05T10:54:55.206824+00:00",
                "updated_at": "2025-06-07T09:07:33.661716+00:00",
                "users": {
                    "email": "myfoundationadmin@example.com",
                    "user_id": 2,
                    "account_status": "active",
                    "is_email_verified": true
                },
                "foundation_types": {
                    "name": "มูลนิธิเพื่อการแพทย์และสาธารณสุข",
                    "type_id": 2,
                    "description": "มูลนิธิที่มุ่งเน้นการส่งเสริมสุขภาพและการแพทย์"
                }
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 10
        }
    },
    "message": "Foundations listed successfully",
    "success": true
}
```

### 10. GET /api/public/foundations/2
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "foundation_id": 2,
        "foundation_name": "มูลนิธิใจดี เทสต์",
        "verified_at": "2025-06-07T09:06:29.935+00:00"
    },
    "message": "Foundation details retrieved successfully",
    "success": true
}
```

### 11. GET /api/foundation/profile/me
**Response:**
```json
{
    "statusCode": 200,
    "data": null,
    "message": "Foundation profile not yet created. Please create one.",
    "success": true
}
```

### 12. PUT /api/foundation/profile/me
**Request Body:**
```json
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
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "foundation_id": 10,
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
        "pickup_contact_info": "โทร 0812345678",
        "verified_by_admin_id": null,
        "verified_at": null,
        "verification_notes": null,
        "created_at": "2025-07-01T07:51:54.562141+00:00",
        "updated_at": "2025-07-01T07:51:54.562141+00:00",
        "foundation_type": {
            "name": "มูลนิธิเพื่อการศึกษา"
        }
    },
    "message": "Foundation profile saved successfully",
    "success": true
}
```

### 13. POST /api/foundation/wishlist-items
**Response:**
```json
{
    "statusCode": 201,
    "data": {
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "item_name": "เสื้อผ้าเด็ก",
        "category_id": 1,
        "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L",
        "quantity_needed": 50,
        "quantity_unit": "ชิ้น",
        "quantity_received": 0,
        "urgency_level": "normal",
        "status": "open_for_donation",
        "example_image_url": null,
        "posted_date": "2025-07-01T08:03:25.086469+00:00",
        "updated_at": "2025-07-01T08:03:25.086469+00:00",
        "category": {
            "name": "เสื้อผ้า"
        },
        "foundation": {
            "foundation_name": "มูลนิธิเด็กไทย"
        }
    },
    "message": "Wishlist item created successfully",
    "success": true
}
```

### 14. GET /api/public/wishlist-items/6
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "item_name": "เสื้อผ้าเด็ก",
        "category_id": 1,
        "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L",
        "quantity_needed": 50,
        "quantity_unit": "ชิ้น",
        "quantity_received": 0,
        "urgency_level": "normal",
        "status": "open_for_donation",
        "example_image_url": null,
        "posted_date": "2025-07-01T08:03:25.086469+00:00",
        "updated_at": "2025-07-01T08:18:40.005036+00:00",
        "foundation": {
            "city": "กรุงเทพฯ",
            "logo_url": "https://example.com/logo.jpg",
            "province": "กรุงเทพมหานคร",
            "website_url": "https://foundation.com",
            "user_account": null,
            "contact_email": "info@foundation.com",
            "foundation_id": 10,
            "foundation_name": "มูลนิธิเด็กไทย"
        },
        "category": {
            "name": "เสื้อผ้า",
            "category_id": 1,
            "description": "เสื้อผ้าและเครื่องแต่งกาย"
        }
    },
    "message": "Wishlist item details retrieved successfully",
    "success": true
}
```

### 15. GET /api/foundation/wishlist-items
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "wishlistItems": [
            {
                "wishlist_item_id": 6,
                "foundation_id": 10,
                "item_name": "เสื้อผ้าเด็ก",
                "category_id": 1,
                "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L",
                "quantity_needed": 50,
                "quantity_unit": "ชิ้น",
                "quantity_received": 0,
                "urgency_level": "normal",
                "status": "open_for_donation",
                "example_image_url": null,
                "posted_date": "2025-07-01T08:03:25.086469+00:00",
                "updated_at": "2025-07-01T08:18:40.005036+00:00",
                "category": {
                    "name": "เสื้อผ้า"
                },
                "foundation": {
                    "foundation_name": "มูลนิธิเด็กไทย"
                }
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 10
        }
    },
    "message": "Foundation's wishlist items retrieved successfully",
    "success": true
}
```

### 16. GET /api/foundation/wishlist-items/6
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "item_name": "เสื้อผ้าเด็ก",
        "category_id": 1,
        "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L",
        "quantity_needed": 50,
        "quantity_unit": "ชิ้น",
        "quantity_received": 0,
        "urgency_level": "normal",
        "status": "open_for_donation",
        "example_image_url": null,
        "posted_date": "2025-07-01T08:03:25.086469+00:00",
        "updated_at": "2025-07-01T08:18:40.005036+00:00",
        "category": {
            "name": "เสื้อผ้า"
        },
        "foundation": {
            "logo_url": "https://example.com/logo.jpg",
            "foundation_name": "มูลนิธิเด็กไทย"
        }
    },
    "message": "Wishlist item details retrieved successfully",
    "success": true
}
```

### 17. PUT /api/foundation/wishlist-items/6
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "item_name": "เสื้อผ้าเด็ก (อัปเดต)",
        "category_id": 1,
        "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L",
        "quantity_needed": 60,
        "quantity_unit": "ตัว",
        "quantity_received": 0,
        "urgency_level": "normal",
        "status": "open_for_donation",
        "example_image_url": null,
        "posted_date": "2025-07-01T08:03:25.086469+00:00",
        "updated_at": "2025-07-01T09:07:23.100536+00:00",
        "category": {
            "name": "เสื้อผ้า"
        },
        "foundation": {
            "foundation_name": "มูลนิธิเด็กไทย"
        }
    },
    "message": "Wishlist item updated successfully",
    "success": true
}
```

### 18. DELETE /api/foundation/wishlist-items/7
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "wishlist_item_id": 7,
        "foundation_id": 10,
        "item_name": "ปลากระป๋อง",
        "category_id": 1,
        "description_detail": "อาหาร",
        "quantity_needed": 60,
        "quantity_unit": "ป๋อง",
        "quantity_received": 0,
        "urgency_level": "normal",
        "status": "open_for_donation",
        "example_image_url": null,
        "posted_date": "2025-07-01T09:16:10.951238+00:00",
        "updated_at": "2025-07-01T09:16:10.951238+00:00"
    },
    "message": "Wishlist item deleted successfully",
    "success": true
}
```

### 19. GET /api/foundation/pledges/received
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "pledges": [],
        "pagination": {
            "currentPage": 1,
            "totalPages": 0,
            "totalItems": 0,
            "itemsPerPage": 10
        }
    },
    "message": "Received pledges retrieved successfully",
    "success": true
}
```

### 20. POST /api/foundation/documents
**Response:**
```json
{
    "statusCode": 201,
    "data": {
        "document_id": 1,
        "foundation_id": 10,
        "document_name": "ใบอนุญาตมูลนิธิ",
        "document_url": "https://example.com/document.pdf",
        "upload_date": "2025-07-01T09:27:19.731935+00:00",
        "verification_status_by_admin": "pending_review",
        "admin_remarks": null
    },
    "message": "Foundation document uploaded successfully and awaiting review.",
    "success": true
}
```

### 21. GET /api/foundation/documents
**Response:**
```json
{
    "statusCode": 200,
    "data": [
        {
            "document_id": 1,
            "foundation_id": 10,
            "document_name": "ใบอนุญาตมูลนิธิ",
            "document_url": "https://example.com/document.pdf",
            "upload_date": "2025-07-01T09:27:19.731935+00:00",
            "verification_status_by_admin": "pending_review",
            "admin_remarks": null
        }
    ],
    "message": "Foundation documents retrieved successfully.",
    "success": true
}
```

### 22. DELETE /api/foundation/documents/1
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "document_id": 1,
        "foundation_id": 10,
        "document_name": "ใบอนุญาตมูลนิธิ",
        "document_url": "https://example.com/document.pdf",
        "upload_date": "2025-07-01T09:27:19.731935+00:00",
        "verification_status_by_admin": "pending_review",
        "admin_remarks": null
    },
    "message": "Foundation document deleted successfully.",
    "success": true
}
```

### 23. POST /api/donor/pledges
**Request Body:**
```json
{
    "wishlist_item_id": 6,
    "quantity_pledged": 10,
    "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
    "delivery_method": "courier_service",
    "courier_company_name": "Kerry Express",
    "tracking_number": "KRY123456789",
    "pickup_address_details": "123 ถนนสุขุมวิท กรุงเทพฯ",
    "pickup_preferred_datetime": "2024-01-15T10:00:00Z"
}
```
**Response:**
```json
{
    "statusCode": 201,
    "data": {
        "pledge_id": 1,
        "donor_id": 9,
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "quantity_pledged": 10,
        "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
        "delivery_method": "courier_service",
        "courier_company_name": "Kerry Express",
        "tracking_number": "KRY123456789",
        "pickup_address_details": null,
        "pickup_preferred_datetime": null,
        "status": "pending_foundation_approval",
        "rejection_reason_by_foundation": null,
        "pledged_at": "2025-07-03T05:28:54.370776+00:00",
        "foundation_action_at": null,
        "foundation_received_at": null,
        "donor_notes_on_receipt": null,
        "updated_at": "2025-07-03T05:28:54.370776+00:00"
    },
    "message": "Donation pledge submitted successfully. Waiting for foundation approval.",
    "success": true
}
```

### 24. GET /api/donor/pledges
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "pledges": [
            {
                "pledge_id": 1,
                "donor_id": 9,
                "wishlist_item_id": 6,
                "foundation_id": 10,
                "quantity_pledged": 10,
                "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
                "delivery_method": "courier_service",
                "courier_company_name": "Kerry Express",
                "tracking_number": "KRY123456789",
                "pickup_address_details": null,
                "pickup_preferred_datetime": null,
                "status": "pending_foundation_approval",
                "rejection_reason_by_foundation": null,
                "pledged_at": "2025-07-03T05:28:54.370776+00:00",
                "foundation_action_at": null,
                "foundation_received_at": null,
                "donor_notes_on_receipt": null,
                "updated_at": "2025-07-03T05:28:54.370776+00:00",
                "wishlist_item": {
                    "item_name": "เสื้อผ้าเด็ก (อัปเดต)",
                    "example_image_url": null
                },
                "foundation": {
                    "logo_url": "https://example.com/logo.jpg",
                    "foundation_name": "มูลนิธิเด็กไทย"
                },
                "images": []
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 10
        }
    },
    "message": "Your donation pledges retrieved successfully",
    "success": true
}
```

### 25. GET /api/donor/pledges/1
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "pledge_id": 1,
        "donor_id": 9,
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "quantity_pledged": 10,
        "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
        "delivery_method": "courier_service",
        "courier_company_name": "Kerry Express",
        "tracking_number": "KRY123456789",
        "pickup_address_details": null,
        "pickup_preferred_datetime": null,
        "status": "pending_foundation_approval",
        "rejection_reason_by_foundation": null,
        "pledged_at": "2025-07-03T05:28:54.370776+00:00",
        "foundation_action_at": null,
        "foundation_received_at": null,
        "donor_notes_on_receipt": null,
        "updated_at": "2025-07-03T05:28:54.370776+00:00",
        "wishlist_item": {
            "status": "open_for_donation",
            "category": {
                "name": "เสื้อผ้า"
            },
            "item_name": "เสื้อผ้าเด็ก (อัปเดต)",
            "updated_at": "2025-07-03T05:21:10.997492+00:00",
            "category_id": 1,
            "posted_date": "2025-07-01T08:03:25.086469+00:00",
            "foundation_id": 10,
            "quantity_unit": "ตัว",
            "urgency_level": "normal",
            "quantity_needed": 60,
            "wishlist_item_id": 6,
            "example_image_url": null,
            "quantity_received": 0,
            "description_detail": "เสื้อผ้าเด็กอายุ 5-10 ปี ขนาด S, M, L"
        },
        "foundation": {
            "city": "กรุงเทพฯ",
            "country": "Thailand",
            "logo_url": "https://example.com/logo.jpg",
            "province": "กรุงเทพมหานคร",
            "created_at": "2025-07-01T07:51:54.562141+00:00",
            "updated_at": "2025-07-03T05:20:30.670993+00:00",
            "postal_code": "10110",
            "verified_at": "2025-07-03T05:20:30+00:00",
            "website_url": "https://foundation.com",
            "address_line1": "123 ถนนสุขุมวิท",
            "address_line2": "แขวงคลองเตย",
            "contact_email": "info@foundation.com",
            "contact_phone": "021234567",
            "foundation_id": 10,
            "license_number": "123456789",
            "foundation_name": "มูลนิธิเด็กไทย",
            "gmaps_embed_url": "https://maps.google.com/...",
            "history_mission": "ช่วยเหลือเด็กด้อยโอกาส",
            "foundation_type_id": 1,
            "social_media_links": {
                "facebook": "https://facebook.com/foundation",
                "instagram": "https://instagram.com/foundation"
            },
            "verification_notes": null,
            "pickup_contact_info": "โทร 0812345678",
            "pickup_service_area": "กรุงเทพฯ และปริมณฑล",
            "verified_by_admin_id": 2,
            "accepts_pickup_service": true
        },
        "images": []
    },
    "message": "Pledge details retrieved successfully",
    "success": true
}
```

### 26. GET /api/foundation/pledges/received
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "pledges": [
            {
                "pledge_id": 1,
                "donor_id": 9,
                "wishlist_item_id": 6,
                "foundation_id": 10,
                "quantity_pledged": 10,
                "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
                "delivery_method": "courier_service",
                "courier_company_name": "Kerry Express",
                "tracking_number": "KRY123456789",
                "pickup_address_details": null,
                "pickup_preferred_datetime": null,
                "status": "pending_foundation_approval",
                "rejection_reason_by_foundation": null,
                "pledged_at": "2025-07-03T05:28:54.370776+00:00",
                "foundation_action_at": null,
                "foundation_received_at": null,
                "donor_notes_on_receipt": null,
                "updated_at": "2025-07-03T05:28:54.370776+00:00",
                "donor": {
                    "email": "user1@email.com",
                    "user_id": 9,
                    "last_name": "ni",
                    "first_name": "ball",
                    "profile_image_url": "https://example.com/new-image.jpg"
                },
                "wishlist_item": {
                    "item_name": "เสื้อผ้าเด็ก (อัปเดต)",
                    "example_image_url": null
                },
                "images": []
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 10
        }
    },
    "message": "Received pledges retrieved successfully",
    "success": true
}
```

### 27. PATCH /api/foundation/pledges/1/approve
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "pledge_id": 1,
        "donor_id": 9,
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "quantity_pledged": 10,
        "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
        "delivery_method": "courier_service",
        "courier_company_name": "Kerry Express",
        "tracking_number": "KRY123456789",
        "pickup_address_details": null,
        "pickup_preferred_datetime": null,
        "status": "approved_by_foundation",
        "rejection_reason_by_foundation": null,
        "pledged_at": "2025-07-03T05:28:54.370776+00:00",
        "foundation_action_at": "2025-07-03T05:44:13.873+00:00",
        "foundation_received_at": null,
        "donor_notes_on_receipt": null,
        "updated_at": "2025-07-03T05:44:13.94978+00:00"
    },
    "message": "Pledge approved successfully.",
    "success": true
}
```

### 28. PATCH /api/foundation/pledges/1/reject
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "pledge_id": 1,
        "donor_id": 9,
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "quantity_pledged": 10,
        "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
        "delivery_method": "courier_service",
        "courier_company_name": "Kerry Express",
        "tracking_number": "KRY123456789",
        "pickup_address_details": null,
        "pickup_preferred_datetime": null,
        "status": "rejected_by_foundation",
        "rejection_reason_by_foundation": "สิ่งของไม่ตรงตามที่ต้องการ",
        "pledged_at": "2025-07-03T05:28:54.370776+00:00",
        "foundation_action_at": "2025-07-03T05:57:47.309+00:00",
        "foundation_received_at": "2025-07-03T05:49:05.293+00:00",
        "donor_notes_on_receipt": null,
        "updated_at": "2025-07-03T05:57:47.408609+00:00"
    },
    "message": "Pledge rejected successfully.",
    "success": true
}
```

### 29. PATCH /api/foundation/pledges/1/confirm-receipt
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "pledge_id": 1,
        "donor_id": 9,
        "wishlist_item_id": 6,
        "foundation_id": 10,
        "quantity_pledged": 10,
        "donor_item_description": "เสื้อผ้าเด็กมือสอง สภาพดี",
        "delivery_method": "courier_service",
        "courier_company_name": "Kerry Express",
        "tracking_number": "KRY123456789",
        "pickup_address_details": null,
        "pickup_preferred_datetime": null,
        "status": "received_by_foundation",
        "rejection_reason_by_foundation": null,
        "pledged_at": "2025-07-03T05:28:54.370776+00:00",
        "foundation_action_at": "2025-07-03T05:57:47.309+00:00",
        "foundation_received_at": "2025-07-03T06:00:49.857+00:00",
        "donor_notes_on_receipt": null,
        "updated_at": "2025-07-03T06:00:49.950775+00:00"
    },
    "message": "Pledge receipt confirmed successfully. Item quantity updated.",
    "success": true
}
```

### 30. POST /api/donor/favorites
**Request Body:**
```json
{
    "foundation_id": 10
}
```
**Response:**
```json
{
    "statusCode": 201,
    "data": {
        "favorite_id": 1,
        "donor_id": 9,
        "foundation_id": 10,
        "added_at": "2025-07-03T06:14:04.814919+00:00"
    },
    "message": "Foundation added to favorites successfully.",
    "success": true
}
```

### 31. GET /api/donor/favorites
**Response:**
```json
{
    "statusCode": 200,
    "data": [
        {
            "favorite_id": 1,
            "added_at": "2025-07-03T06:14:04.814919+00:00",
            "foundation": {
                "city": "กรุงเทพฯ",
                "logo_url": "https://example.com/logo.jpg",
                "province": "กรุงเทพมหานคร",
                "foundation_id": 10,
                "foundation_name": "มูลนิธิเด็กไทย",
                "foundation_type": {
                    "name": "มูลนิธิเพื่อการศึกษา"
                }
            }
        }
    ],
    "message": "Favorite foundations retrieved successfully.",
    "success": true
}
```

### 32. DELETE /api/donor/favorites/2
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "favorite_id": 2,
        "donor_id": 9,
        "foundation_id": 2,
        "added_at": "2025-07-03T06:18:33.986623+00:00"
    },
    "message": "Foundation removed from favorites successfully.",
    "success": true
}
```

### 33. POST /api/donor/pledges/1/reviews
**Request Body:**
```json
{
  "rating_score": 5,
  "comment_text": "มูลนิธิให้บริการดีมาก รับสิ่งของอย่างเป็นมิตร"
}
```
**Response:**
```json
{
    "statusCode": 201,
    "data": {
        "review_id": 1,
        "pledge_id": 1,
        "donor_id": 9,
        "foundation_id": 10,
        "rating_score": 5,
        "comment_text": "มูลนิธิให้บริการดีมาก รับสิ่งของอย่างเป็นมิตร",
        "is_approved_by_admin": false,
        "admin_review_remarks": null,
        "reviewed_at": "2025-07-03T06:26:09.669456+00:00",
        "updated_at": "2025-07-03T06:26:09.669456+00:00"
    },
    "message": "Review submitted successfully. It will be visible after admin approval.",
    "success": true
}
```

### 34. GET /api/admin/users
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "users": [
            {
                "user_id": 11,
                "email": "admin1@email.com",
                "password_hash": "$2b$10$yOuubRBsXiC5.neBkiejaOggqgg4fFa3oTFzZAbs76pz85TayG2M6",
                "first_name": "lnw",
                "last_name": "ball",
                "phone_number": "0812345672",
                "profile_image_url": "https://example.com/profile.jpg",
                "user_type": "system_admin",
                "is_email_verified": false,
                "account_status": "active",
                "agreed_to_terms_at": "2025-07-03T06:39:35.447+00:00",
                "agreed_to_privacy_at": "2025-07-03T06:39:35.447+00:00",
                "created_at": "2025-07-03T06:39:36.195949+00:00",
                "updated_at": "2025-07-03T06:40:02.196058+00:00",
                "last_login_at": "2025-07-03T06:40:02.109+00:00"
            },
            {
                "user_id": 10,
                "email": "foundation1@email.com",
                "password_hash": "$2b$10$Jdcsh9Ev7eTiqpJblBR4au6yYzbvRfPaH6csSNvCFl2zVcWhQna6a",
                "first_name": "ball",
                "last_name": "ni",
                "phone_number": "0812345679",
                "profile_image_url": "https://example.com/profile.jpg",
                "user_type": "foundation_admin",
                "is_email_verified": false,
                "account_status": "pending_verification",
                "agreed_to_terms_at": "2025-07-01T07:34:37.802+00:00",
                "agreed_to_privacy_at": "2025-07-01T07:34:37.802+00:00",
                "created_at": "2025-07-01T07:34:38.286822+00:00",
                "updated_at": "2025-07-03T06:39:24.336946+00:00",
                "last_login_at": "2025-07-03T06:33:12.264+00:00"
            },
            {
                "user_id": 9,
                "email": "user1@email.com",
                "password_hash": "$2b$10$7s4ZEE8bDXdpwgTAkjj.juHnpfCjG8CIdR.E6QA8dNdNsm0UQhKVC",
                "first_name": "ball",
                "last_name": "ni",
                "phone_number": "0812345678",
                "profile_image_url": "https://example.com/new-image.jpg",
                "user_type": "donor",
                "is_email_verified": false,
                "account_status": "active",
                "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
                "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
                "created_at": "2025-06-30T08:18:39.081355+00:00",
                "updated_at": "2025-07-03T06:07:00.305159+00:00",
                "last_login_at": "2025-07-03T06:07:00.194+00:00"
            },
            {
                "user_id": 8,
                "email": "user@email.com",
                "password_hash": "$2b$10$sty6JLFf5ySyBxTPDxL7LeTB/KIOjpgo3Tpmu7.FhdDxiezIZ6LFG",
                "first_name": "ชื่อจริง",
                "last_name": "นามสกุล",
                "phone_number": "0812345678",
                "profile_image_url": "https://example.com/profile.jpg",
                "user_type": "donor",
                "is_email_verified": false,
                "account_status": "active",
                "agreed_to_terms_at": "2025-06-30T07:45:18.677+00:00",
                "agreed_to_privacy_at": "2025-06-30T07:45:18.677+00:00",
                "created_at": "2025-06-30T07:45:20.439044+00:00",
                "updated_at": "2025-06-30T07:45:20.439044+00:00",
                "last_login_at": null
            },
            {
                "user_id": 7,
                "email": "65011211019@msu.ac.th",
                "password_hash": "$2b$10$BM3L0hni7V9P7Ddx7AVME..cKKWsFTAs1hH28Mvnm8357QPu2KP6u",
                "first_name": "nisio",
                "last_name": "god",
                "phone_number": null,
                "profile_image_url": null,
                "user_type": "foundation_admin",
                "is_email_verified": false,
                "account_status": "pending_verification",
                "agreed_to_terms_at": "2025-06-29T08:45:21.282+00:00",
                "agreed_to_privacy_at": "2025-06-29T08:45:21.282+00:00",
                "created_at": "2025-06-29T08:45:21.700524+00:00",
                "updated_at": "2025-06-29T08:49:19.14241+00:00",
                "last_login_at": "2025-06-29T08:49:19.015+00:00"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 5,
            "itemsPerPage": 20
        }
    },
    "message": "Users listed successfully",
    "success": true
}
```

### 35. GET /api/admin/users/{user_id}
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "user_id": 9,
        "email": "user1@email.com",
        "password_hash": "$2b$10$7s4ZEE8bDXdpwgTAkjj.juHnpfCjG8CIdR.E6QA8dNdNsm0UQhKVC",
        "first_name": "ball",
        "last_name": "ni",
        "phone_number": "0812345678",
        "profile_image_url": "https://example.com/new-image.jpg",
        "user_type": "donor",
        "is_email_verified": false,
        "account_status": "active",
        "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
        "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
        "created_at": "2025-06-30T08:18:39.081355+00:00",
        "updated_at": "2025-07-03T06:07:00.305159+00:00",
        "last_login_at": "2025-07-03T06:07:00.194+00:00"
    },
    "message": "User details retrieved.",
    "success": true
}
```

### 36. PATCH /api/admin/users/{user_id}/ban
**Request Body:**
```json
{
  "ban_reason": "ละเมิดข้อตกลงการใช้งาน"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "user": {
            "user_id": 9,
            "email": "user1@email.com",
            "password_hash": "$2b$10$7s4ZEE8bDXdpwgTAkjj.juHnpfCjG8CIdR.E6QA8dNdNsm0UQhKVC",
            "first_name": "ball",
            "last_name": "ni",
            "phone_number": "0812345678",
            "profile_image_url": "https://example.com/new-image.jpg",
            "user_type": "donor",
            "is_email_verified": false,
            "account_status": "banned",
            "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
            "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
            "created_at": "2025-06-30T08:18:39.081355+00:00",
            "updated_at": "2025-07-03T08:19:13.099231+00:00",
            "last_login_at": "2025-07-03T06:07:00.194+00:00"
        }
    },
    "message": "User banned successfully",
    "success": true
}
```

### 37. PATCH /api/admin/users/{user_id}/unban
**Request Body:**
```json
{
  "unban_reason": "admin manual unban"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "user": {
            "user_id": 9,
            "email": "user1@email.com",
            "password_hash": "$2b$10$7s4ZEE8bDXdpwgTAkjj.juHnpfCjG8CIdR.E6QA8dNdNsm0UQhKVC",
            "first_name": "ball",
            "last_name": "ni",
            "phone_number": "0812345678",
            "profile_image_url": "https://example.com/new-image.jpg",
            "user_type": "donor",
            "is_email_verified": false,
            "account_status": "active",
            "agreed_to_terms_at": "2025-06-30T08:18:37.693+00:00",
            "agreed_to_privacy_at": "2025-06-30T08:18:37.693+00:00",
            "created_at": "2025-06-30T08:18:39.081355+00:00",
            "updated_at": "2025-07-07T05:30:17.234032+00:00",
            "last_login_at": "2025-07-03T06:07:00.194+00:00"
        }
    },
    "message": "User unbanned successfully",
    "success": true
}
```

### 38. GET /api/admin/foundations
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "foundations": [
            {
                "foundation_id": 10,
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
                "pickup_contact_info": "โทร 0812345678",
                "verified_by_admin_id": null,
                "verified_at": "2025-07-03T05:20:30+00:00",
                "verification_notes": null,
                "created_at": "2025-07-01T07:51:54.562141+00:00",
                "updated_at": "2025-07-03T06:22:55.069912+00:00"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 20
        }
    },
    "message": "Foundations listed successfully",
    "success": true
}
```

### 39. GET /api/admin/foundations/{foundation_id}
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "foundation_id": 10,
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
        "pickup_contact_info": "โทร 0812345678",
        "verified_by_admin_id": null,
        "verified_at": "2025-07-03T05:20:30+00:00",
        "verification_notes": null,
        "created_at": "2025-07-01T07:51:54.562141+00:00",
        "updated_at": "2025-07-03T06:22:55.069912+00:00"
    },
    "message": "Foundation details retrieved successfully",
    "success": true
}
```

### 40. PATCH /api/admin/foundations/{foundation_id}/approve-account
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "updatedUser": {
            "user_id": 10,
            "account_status": "active"
        },
        "updatedFoundation": {
            "foundation_id": 10,
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
            "pickup_contact_info": "โทร 0812345678",
            "verified_by_admin_id": 11,
            "verified_at": "2025-07-07T05:57:20.568+00:00",
            "verification_notes": null,
            "created_at": "2025-07-01T07:51:54.562141+00:00",
            "updated_at": "2025-07-07T05:57:20.337206+00:00"
        }
    },
    "message": "Foundation account approved and verified.",
    "success": true
}
```

### 41. PATCH /api/admin/users/{user_id}/reset-status
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "user_id": 10,
        "email": "foundation1@email.com",
        "password_hash": "$2b$10$Jdcsh9Ev7eTiqpJblBR4au6yYzbvRfPaH6csSNvCFl2zVcWhQna6a",
        "first_name": "ball",
        "last_name": "ni",
        "phone_number": "0812345679",
        "profile_image_url": "https://example.com/profile.jpg",
        "user_type": "foundation_admin",
        "is_email_verified": false,
        "account_status": "pending_verification",
        "agreed_to_terms_at": "2025-07-01T07:34:37.802+00:00",
        "agreed_to_privacy_at": "2025-07-01T07:34:37.802+00:00",
        "created_at": "2025-07-01T07:34:38.286822+00:00",
        "updated_at": "2025-07-07T06:10:03.324829+00:00",
        "last_login_at": "2025-07-03T06:33:12.264+00:00"
    },
    "message": "User status reset to pending_verification",
    "success": true
}
```

### 42. PATCH /api/admin/foundations/{foundation_id}/reject-account
**Request Body:**
```json
{
  "verification_notes": "เหตุผลที่ปฏิเสธ เช่น เอกสารไม่ครบ",
  "admin_notes": "กรุณาส่งเอกสารเพิ่มเติม"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "updatedUser": {
            "user_id": 10,
            "account_status": "inactive"
        }
    },
    "message": "Foundation account registration rejected.",
    "success": true
}
```

### 43. GET /api/admin/foundations/{foundation_id}/documents
**Response:**
```json
{
    "statusCode": 200,
    "data": [
        {
            "document_id": 2,
            "foundation_id": 10,
            "document_name": "ใบอนุญาตมูลนิธิ",
            "document_url": "https://example.com/document.pdf",
            "upload_date": "2025-07-03T06:36:25.247719+00:00",
            "verification_status_by_admin": "pending_review",
            "admin_remarks": null
        }
    ],
    "message": "Documents for foundation 10 retrieved.",
    "success": true
}
```

### 44. PATCH /api/admin/foundations/documents/{documentId}/review
**Request Body:**
```json
{
  "verification_status_by_admin": "approved",
  "admin_remarks": "หมายเหตุเพิ่มเติม (optional)"
}
```
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "document_id": 2,
        "foundation_id": 10,
        "document_name": "ใบอนุญาตมูลนิธิ",
        "document_url": "https://example.com/document.pdf",
        "upload_date": "2025-07-03T06:36:25.247719+00:00",
        "verification_status_by_admin": "approved",
        "admin_remarks": "หมายเหตุเพิ่มเติม (optional)"
    },
    "message": "Document 2 status updated to approved.",
    "success": true
}
```

### 45. GET /api/admin/content-pages
**Response:**
```json
{
    "statusCode": 200,
    "data": [],
    "message": "Content pages listed.",
    "success": true
}
```
### 46. POST /api/admin/content-pages (meta_description)
**Request Body:**
```json
{
  "slug": "about-us",
  "title": "เกี่ยวกับเรา",
  "body_content_html": "<h1>เกี่ยวกับเรา</h1><p>รายละเอียด...</p>",
  "meta_description": "ข้อมูลเกี่ยวกับระบบบริจาค"
}
```
**Response:**
```json
{
    "statusCode": 201,
    "data": {
        "page_id": 1,
        "slug": "about-us",
        "title": "เกี่ยวกับเรา",
        "body_content_html": "<h1>เกี่ยวกับเรา</h1><p>รายละเอียด...</p>",
        "last_updated_by_admin_id": 11,
        "updated_at": "2025-07-07T06:53:03.239024+00:00",
        "meta_description": "ข้อมูลเกี่ยวกับระบบบริจาค"
    },
    "message": "Content page created.",
    "success": true
}
```
### 47. GET /api/public/content-pages/1
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "slug": "about-us",
        "title": "เกี่ยวกับเรา",
        "body_content_html": "<h1>เกี่ยวกับเรา</h1><p>รายละเอียด...</p>",
        "updated_at": "2025-07-07T06:53:03.239024+00:00",
        "meta_description": "ข้อมูลเกี่ยวกับระบบบริจาค"
    },
    "message": "Content page retrieved.",
    "success": true
}
```
### 48. GET /api/admin/content-pages/1
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "page_id": 1,
        "slug": "about-us",
        "title": "เกี่ยวกับเรา",
        "body_content_html": "<h1>เกี่ยวกับเรา</h1><p>รายละเอียด...</p>",
        "last_updated_by_admin_id": 11,
        "updated_at": "2025-07-07T06:53:03.239024+00:00",
        "meta_description": "ข้อมูลเกี่ยวกับระบบบริจาค"
    },
    "message": "Content page retrieved.",
    "success": true
}
```
### 49. PUT /api/admin/content-pages/1
**Request Body:**
 {
    "statusCode": 200,
    "data": {
        "page_id": 1,
        "slug": "about-us",
        "title": "ซื้อสัตย์ ขยัน อดทน",
        "body_content_html": "<h1>ตึงๆ</h1><p>ของดี</p>",
        "last_updated_by_admin_id": 11,
        "updated_at": "2025-07-07T08:11:21.009546+00:00",
        "meta_description": "ข้อมูลเกี่ยวกับระบบบริจาค"
    },
    "message": "Content page updated.",
    "success": true
 }
```

### 50. GET /api/notifications
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "notifications": [
            {
                "notification_id": 3,
                "recipient_user_id": 9,
                "notification_type": "review_approved",
                "related_entity_id": 1,
                "message_short": "รีวิวของคุณสำหรับ 1 ได้รับการอนุมัติแล้ว",
                "message_long": "ความคิดเห็นของคุณจะปรากฏบนหน้าโปรไฟล์ของมูลนิธิ ขอบคุณสำหรับความคิดเห็น!",
                "link_url": "/foundations/10/reviews",
                "is_read": false,
                "created_at": "2025-07-15T10:35:14.961356+00:00"
            },
            {
                "notification_id": 2,
                "recipient_user_id": 9,
                "notification_type": "review_approved",
                "related_entity_id": 1,
                "message_short": "รีวิวของคุณสำหรับ 1 ได้รับการอนุมัติแล้ว",
                "message_long": "ความคิดเห็นของคุณจะปรากฏบนหน้าโปรไฟล์ของมูลนิธิ ขอบคุณสำหรับความคิดเห็น!",
                "link_url": "/foundations/10/reviews",
                "is_read": false,
                "created_at": "2025-07-07T08:43:53.741533+00:00"
            },
            {
                "notification_id": 1,
                "recipient_user_id": 9,
                "notification_type": "review_rejected",
                "related_entity_id": 1,
                "message_short": "รีวิวของคุณสำหรับ 1 ไม่ผ่านการอนุมัติ",
                "message_long": "เหตุผล: รีวิวไม่เหมาะสม ใช้คำที่ไม่สุภาพ. กรุณาติดต่อผู้ดูแลหากมีข้อสงสัย",
                "link_url": "/donor/donations/1",
                "is_read": false,
                "created_at": "2025-07-07T08:35:59.753268+00:00"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 3,
            "itemsPerPage": 15
        }
    },
    "message": "Notifications retrieved successfully.",
    "success": true
}
```

### 51. POST /api/upload/image
**Response:**
```json
{
    "statusCode": 200,
    "data": {
        "imageUrl": "https://hcvnromveklqcyhsbmxz.supabase.co/storage/v1/object/public/general-images/user_9/9993e8aa-285a-4b94-b023-e4bf46f09cbc.JPG",
        "originalName": "DSC_0776.JPG",
        "size": 6689176,
        "mimetype": "image/jpeg"
    },
    "message": "Image uploaded successfully",
    "success": true
}
```

หากต้องการให้ฉันพยายามแทรกซ้ำอีกครั้ง หรือแนบไฟล์มาใหม่เพื่อให้แก้ไข แจ้งได้เลยครับ!
---

## หมายเหตุ
- กรณีทดสอบไม่ผ่าน ให้ระบุรายละเอียดข้อผิดพลาดในช่องหมายเหตุ
- สามารถเพิ่ม/แก้ไขตารางผลการทดสอบและตัวอย่าง response ได้ตามรอบการทดสอบ 