# 💍 Hướng Dẫn Tạo Thiệp Cưới Online

## 🚀 Cách Sử Dụng Nhanh

Bạn **KHÔNG CẦN** biết code! Chỉ cần thay đổi thông tin trong file `wedding-config.json` là đủ.

## 📋 Các Bước Thực Hiện

### Bước 1: Chuẩn bị ảnh của bạn
1. **Chụp/Thu thập ảnh cưới** của bạn (4-8 ảnh đẹp nhất)
2. **Upload ảnh** lên một trong các dịch vụ miễn phí:
   - [Imgur](https://imgur.com) (Khuyến nghị)
   - [Cloudinary](https://cloudinary.com)
   - [ImageBB](https://imgbb.com)
   - Google Drive (đặt chế độ công khai)

3. **Copy link ảnh** (URL) sau khi upload

### Bước 2: Chỉnh sửa file wedding-config.json
Mở file `wedding-config.json` và thay đổi các thông tin sau:

#### 🏠 **Thông tin cô dâu chú rể:**
```json
"coupleInfo": {
  "bride": {
    "name": "Tên cô dâu của bạn",
    "parents": "Con gái của ông bà...",
    "image": "LINK_ẢNH_CÔ_DÂU"
  },
  "groom": {
    "name": "Tên chú rể của bạn", 
    "parents": "Con trai của ông bà...",
    "image": "LINK_ẢNH_CHÚ_RỂ"
  }
}
```

#### 📅 **Ngày cưới:**
```json
"weddingDate": {
  "datetime": "2024-12-25T09:00:00",  // Năm-Tháng-Ngày T Giờ:Phút:Giây
  "displayDate": "25 . 12 . 2024",   // Hiển thị trên website
  "invitationText": "Chúng tôi sắp kết hôn!"
}
```

#### 🖼️ **Ảnh Hero Slider (4 ảnh nền chính):**
```json
"heroSlider": {
  "images": [
    {"url": "LINK_ẢNH_1", "alt": "Ảnh cưới chính"},
    {"url": "LINK_ẢNH_2", "alt": "Ảnh cưới 1"},
    {"url": "LINK_ẢNH_3", "alt": "Ảnh cưới 2"},
    {"url": "LINK_ẢNH_4", "alt": "Ảnh cưới 3"}
  ]
}
```

#### 🎨 **Album ảnh cưới:**
```json
"galleryImages": {
  "images": [
    {"url": "LINK_ALBUM_1", "alt": "Album ảnh cưới 1"},
    {"url": "LINK_ALBUM_2", "alt": "Album ảnh cưới 2"},
    {"url": "LINK_ALBUM_3", "alt": "Album ảnh cưới 3"},
    {"url": "LINK_ALBUM_4", "alt": "Album ảnh cưới 4"}
  ]
}
```

#### 🏛️ **Địa điểm tổ chức:**
```json
"weddingEvents": {
  "ceremony": {
    "title": "Lễ Thành Hôn",
    "date": "Thứ 7, 25/12/2024",
    "time": "9:00 AM",
    "venue": "Tên địa điểm lễ cưới",
    "address": "Địa chỉ chi tiết"
  },
  "reception": {
    "title": "Tiệc Cưới", 
    "date": "Thứ 7, 25/12/2024",
    "time": "6:00 PM",
    "venue": "Tên nhà hàng/khách sạn",
    "address": "Địa chỉ chi tiết"
  }
}
```

### Bước 3: Kiểm tra kết quả
1. Mở file `index.html` bằng trình duyệt
2. Website sẽ tự động load thông tin từ file JSON
3. Kiểm tra tất cả ảnh và thông tin có hiển thị đúng không

### Bước 4: Chia sẻ
1. **Hosting miễn phí:** Upload toàn bộ folder lên:
   - [Netlify](https://netlify.com) (Khuyến nghị)
   - [Vercel](https://vercel.com)
   - [GitHub Pages](https://pages.github.com)

2. **Chia sẻ link** với bạn bè và người thân

## 🎯 Mẹo Hay

### 📸 **Về ảnh:**
- **Kích thước khuyến nghị:** 1920x1080px trở lên
- **Format:** JPG hoặc PNG
- **Chất lượng:** Tối thiểu 80% để đảm bảo rõ nét
- **Số lượng:** 4-8 ảnh là đủ (quá nhiều sẽ chậm)

### 🎨 **Về phong cách:**
- Chọn ảnh có **tone màu tương đồng**
- **Ảnh ngang** sẽ đẹp hơn ảnh dọc
- Tránh ảnh **quá tối** hoặc **quá sáng**

### ⚡ **Về hiệu suất:**
- Nén ảnh trước khi upload (dùng [TinyPNG](https://tinypng.com))
- Test website trên nhiều thiết bị khác nhau
- Kiểm tra tốc độ internet khi chia sẻ

## 🆘 Khắc Phục Sự Cố

### ❌ **Ảnh không hiển thị:**
- Kiểm tra link ảnh có đúng không
- Đảm bảo ảnh được đặt ở chế độ "Public"
- Thử mở link ảnh trực tiếp trên trình duyệt

### ❌ **Countdown không đúng:**
- Kiểm tra format ngày: `YYYY-MM-DDTHH:MM:SS`
- Đảm bảo năm, tháng, ngày hợp lệ

### ❌ **Website không cập nhật:**
- Xóa cache trình duyệt (Ctrl + F5)
- Kiểm tra file JSON có lỗi syntax không
- Dùng [JSONLint](https://jsonlint.com) để validate JSON

## 📞 Liên Hệ Hỗ Trợ

Nếu gặp khó khăn, hãy:
1. Kiểm tra lại file JSON theo hướng dẫn
2. So sánh với file mẫu có sẵn
3. Đọc kỹ thông báo lỗi trên Console (F12)

---

## 🎉 Chúc bạn có một đám cưới thật hạnh phúc! 💕

**Made with ❤️ for your special day** 