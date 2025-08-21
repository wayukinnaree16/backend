# คู่มือแก้ไขปัญหา extremely_urgent enum ใน Supabase Database

## ปัญหา
- Frontend ส่งค่า `extremely_urgent` ไปยัง backend
- Database ไม่มี enum value `extremely_urgent` ทำให้เกิด error 400

## วิธีแก้ไข

### ขั้นตอนที่ 1: เข้าสู่ Supabase Dashboard
1. เข้าไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor** ในเมนูด้านซ้าย

### ขั้นตอนที่ 2: สร้าง enum type ใหม่
รันคำสั่งจากไฟล์ `add_extremely_urgent_enum.sql`:
```sql
CREATE TYPE urgency_level AS ENUM ('normal', 'urgent', 'very_urgent', 'extremely_urgent');
```

### ขั้นตอนที่ 4: ตรวจสอบผลลัพธ์
รันคำสั่งนี้เพื่อยืนยันว่า enum ได้รับการอัปเดต:
```sql
SELECT unnest(enum_range(NULL::urgency_level)) AS updated_values;
```

คุณควรเห็น: `normal`, `urgent`, `very_urgent`, `extremely_urgent`

### ขั้นตอนที่ 5: ทดสอบ API
1. เริ่มต้น backend server: `npm run dev`
2. เริ่มต้น frontend server: `npm run dev`
3. ทดสอบการแก้ไข priority level เป็น "เร่งด่วน" ใน wishlist item

## หมายเหตุ
- หาก enum type `urgency_level` ไม่มีอยู่ ให้สร้างใหม่:
```sql
CREATE TYPE urgency_level AS ENUM ('normal', 'urgent', 'very_urgent', 'extremely_urgent');
```

- ตรวจสอบว่าตาราง `foundation_wishlist_items` ใช้ enum type นี้:
```sql
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'foundation_wishlist_items' 
AND column_name = 'urgency_level';
```

## การแก้ไขปัญหาเพิ่มเติม

หากยังมีปัญหา ให้ตรวจสอบ:
1. **Table Schema**: ตรวจสอบว่าคอลัมน์ `urgency_level` ใช้ enum type ที่ถูกต้อง
2. **Existing Data**: ตรวจสอบว่าข้อมูลเก่าไม่มีค่าที่ไม่ถูกต้อง
3. **Backend Validation**: ตรวจสอบว่า validator ใน `wishlist.validator.js` มี `extremely_urgent` (✅ มีแล้ว)
4. **Frontend Mapping**: ตรวจสอบว่า frontend map ค่าถูกต้อง (✅ ถูกต้องแล้ว)

## ไฟล์ที่เกี่ยวข้อง
- `backend/src/api/validators/wishlist.validator.js` - Backend validation
- `frontend/src/pages/wishlist/WishlistDetail.tsx` - Frontend priority mapping
- `backend/add_extremely_urgent_enum.sql` - SQL script สำหรับแก้ไข database