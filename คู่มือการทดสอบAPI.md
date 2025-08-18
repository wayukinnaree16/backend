# คู่มือการทดสอบ API สำหรับ Admin

---

## 1. ประเภทมูลนิธิ (Foundation Types)

- **Endpoint:** `http://localhost:8080/api/admin/foundation-types`

### 1.1 ดึงข้อมูลประเภทมูลนิธิทั้งหมด (GET)
- **Endpoint:** `/`
- **Method:** `GET`
- **รายละเอียด:** ดึงข้อมูลประเภทมูลนิธิทั้งหมดที่มีอยู่ในระบบ
- **ตัวอย่าง Response:**
  ```json
  {
    "success": true,
    "data": {
      "foundation_types": [
        {
          "id": 1,
          "name": "เพื่อเด็กและเยาวชน",
          "description": "มูลนิธิที่ช่วยเหลือเด็กและเยาวชน"
        },
        {
          "id": 2,
          "name": "เพื่อสัตว์",
          "description": "มูลนิธิที่ช่วยเหลือสัตว์"
        }
      ]
    }
  }
  ```

### 1.2 เพิ่มประเภทมูลนิธิใหม่ (POST)
- **Endpoint:** `/`
- **Method:** `POST`
- **รายละเอียด:** เพิ่มประเภทมูลนิธิใหม่เข้าสู่ระบบ
- **Body Request:**
  ```json
  {
    "name": "ชื่อประเภทมูลนิธิ",
    "description": "รายละเอียด (ถ้ามี)"
  }
  ```
- **ตัวอย่าง Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "name": "ชื่อประเภทมูลนิธิ",
      "description": "รายละเอียด (ถ้ามี)"
    }
  }
  ```

### 1.3 แก้ไขข้อมูลประเภทมูลนิธิ (PUT)
- **Endpoint:** `/:id`
- **Method:** `PUT`
- **รายละเอียด:** แก้ไขข้อมูลประเภทมูลนิธิที่มีอยู่
- **Body Request:**
  ```json
  {
    "name": "ชื่อใหม่",
    "description": "รายละเอียดใหม่"
  }
  ```
- **ตัวอย่าง Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "name": "ชื่อใหม่",
      "description": "รายละเอียดใหม่"
    }
  }
  ```

### 1.4 ลบประเภทมูลนิธิ (DELETE)
- **Endpoint:** `/:id`
- **Method:** `DELETE`
- **รายละเอียด:** ลบประเภทมูลนิธิออกจากระบบ
- **ตัวอย่าง Response:**
  - **Status Code:** `204 No Content`

---

## 2. หมวดหมู่สิ่งของ (Item Categories)

- **Endpoint:** `http://localhost:8080/api/admin/item-categories`
- **หมายเหตุ:** API ส่วนนี้ยังเป็น Placeholder และยังไม่ได้ Implement Logic การทำงานจริง

### 2.1 ดึงข้อมูลหมวดหมู่ทั้งหมด (GET)
- **Endpoint:** `/`
- **Method:** `GET`

### 2.2 เพิ่มหมวดหมู่ใหม่ (POST)
- **Endpoint:** `/`
- **Method:** `POST`

### 2.3 แก้ไขข้อมูลหมวดหมู่ (PUT)
- **Endpoint:** `/:id`
- **Method:** `PUT`

### 2.4 ลบหมวดหมู่ (DELETE)
- **Endpoint:** `/:id`
- **Method:** `DELETE`

---

## 3. การบริจาค (Donations)

- **Endpoint:** `http://localhost:8080/api/admin/donations`

### 3.1 ดึงข้อมูลสถิติการบริจาค (GET)
- **Endpoint:** `/statistics`
- **Method:** `GET`
- **รายละเอียด:** ดึงข้อมูลสรุปและสถิติต่างๆ ที่เกี่ยวกับการบริจาค

---

## 4. การจัดการมูลนิธิ (Foundations)

- **Endpoint:** `http://localhost:8080/api/admin/foundations`

### 4.1 ดึงรายชื่อมูลนิธิที่รอการตรวจสอบ (GET)
- **Endpoint:** `/pending-verification`
- **Method:** `GET`

### 4.2 อนุมัติบัญชีมูลนิธิ (PATCH)
- **Endpoint:** `/:foundationId/approve-account`
- **Method:** `PATCH`

### 4.3 ปฏิเสธบัญชีมูลนิธิ (PATCH)
- **Endpoint:** `/:foundationId/reject-account`
- **Method:** `PATCH`

### 4.4 ดึงเอกสารของมูลนิธิเพื่อตรวจสอบ (GET)
- **Endpoint:** `/:foundationId/documents`
- **Method:** `GET`

### 4.5 ตรวจสอบเอกสารของมูลนิธิ (PATCH)
- **Endpoint:** `/documents/:documentId/review`
- **Method:** `PATCH`

### 4.6 ดึงรายชื่อมูลนิธิทั้งหมด (GET)
- **Endpoint:** `/`
- **Method:** `GET`

### 4.7 ดึงข้อมูล chi tiết ของมูลนิธิ (GET)
- **Endpoint:** `/:foundationId`
- **Method:** `GET`

---

## 5. การจัดการผู้ใช้งาน (Users)

- **Endpoint:** `http://localhost:8080/api/admin/users`

### 5.1 ดึงรายชื่อผู้ใช้ทั้งหมด (GET)
- **Endpoint:** `/`
- **Method:** `GET`

### 5.2 ดึงข้อมูล chi tiết ของผู้ใช้ (GET)
- **Endpoint:** `/:userId`
- **Method:** `GET`

### 5.3 อัปเดตสถานะบัญชีผู้ใช้ (PATCH)
- **Endpoint:** `/:userId/status`
- **Method:** `PATCH`

### 5.4 ระงับบัญชีผู้ใช้ (Ban) (PATCH)
- **Endpoint:** `/:userId/ban`
- **Method:** `PATCH`

### 5.5 ยกเลิกการระงับบัญชีผู้ใช้ (Unban) (PATCH)
- **Endpoint:** `/:userId/unban`
- **Method:** `PATCH`

### 5.6 รีเซ็ตสถานะผู้ใช้ (PATCH)
- **Endpoint:** `/:userId/reset-status`
- **Method:** `PATCH`
