# 📦 Hướng dẫn Cài đặt - Hero Lab

## ✅ Đúng rồi! Chỉ cần 1 lệnh

Sau khi clone code về, bạn chỉ cần chạy:

```bash
docker-compose up -d --build
```

**Thế là xong!** Hệ thống sẽ tự động:
- ✅ Build Docker images
- ✅ Cài đặt tất cả dependencies
- ✅ Chạy database migrations
- ✅ Start backend server (port 8000)
- ✅ Start frontend server (port 3000)

---

## 🌐 Truy cập

Sau khi chạy lệnh trên (đợi 1-2 phút để build):

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

---

## 📋 Yêu cầu

Chỉ cần:
- **Docker** (version 20.10+)
- **Docker Compose** (version 1.29+)

Kiểm tra:
```bash
docker --version
docker-compose --version
```

---

## 🎯 Lần đầu sử dụng

1. **Đăng ký tài khoản**: Truy cập http://localhost:3000/register
2. **Upload file**: Upload file `.txt` (có file mẫu `fake_signal_data.txt` trong project)
3. **Process**: Click nút "Process" để xử lý dữ liệu
4. **Xem kết quả**: Xem waveforms và metrics

---

## 🔧 Các lệnh thường dùng

```bash
# Chạy hệ thống
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Dừng hệ thống
docker-compose down

# Dừng và xóa data
docker-compose down -v

# Restart
docker-compose restart
```

---

## ❓ Vấn đề thường gặp

### Port đã được sử dụng
Sửa port trong `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Thay đổi port bên trái
```

### Build lỗi
```bash
docker-compose build --no-cache
docker-compose up -d
```

---

**Không cần cài đặt Python, Node.js hay bất kỳ thứ gì khác! Tất cả đã có trong Docker.**

