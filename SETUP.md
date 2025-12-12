# 🚀 Hướng dẫn Setup - Hero Lab

## Cho người mới clone code về

### Yêu cầu duy nhất:
- **Docker** và **Docker Compose** đã được cài đặt

Kiểm tra:
```bash
docker --version
docker-compose --version
```

Nếu chưa có, cài đặt tại: https://docs.docker.com/get-docker/

---

## ⚡ Chạy ngay (Chỉ 1 lệnh!)

```bash
docker-compose up -d --build
```

**Xong!** Hệ thống đã sẵn sàng.

---

## 🌐 Truy cập

Sau khi chạy lệnh trên (đợi 1-2 phút để build xong):

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

---

## 📝 Lần đầu sử dụng

### 1. Đăng nhập với tài khoản mặc định

Tài khoản admin đã được tự động tạo:

- **Email**: `admin@hero-lab.com`
- **Password**: `1234`

Truy cập http://localhost:3000/login và đăng nhập.

Hoặc đăng ký tài khoản mới tại http://localhost:3000/register

### 2. Upload và xử lý dữ liệu

1. Đăng nhập tại http://localhost:3000/login
2. Upload file `.txt` (ví dụ: `fake_signal_data.txt` có sẵn trong project)
3. Click "Process" để xử lý
4. Xem kết quả waveforms và metrics

---

## 🔧 Các lệnh hữu ích

### Xem logs
```bash
docker-compose logs -f
```

### Dừng hệ thống
```bash
docker-compose down
```

### Dừng và xóa tất cả data
```bash
docker-compose down -v
```

### Restart một service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild lại (khi có thay đổi code)
```bash
docker-compose up -d --build
```

---

## ❓ Troubleshooting

### Port đã được sử dụng

Nếu port 3000 hoặc 8000 đã được dùng, sửa trong `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Thay đổi port bên trái
```

### Lỗi build

```bash
# Xóa cache và build lại
docker-compose build --no-cache
docker-compose up -d
```

### Kiểm tra containers đang chạy

```bash
docker-compose ps
```

### Xem logs của một service cụ thể

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## ✅ Checklist sau khi clone

- [ ] Đã cài Docker và Docker Compose
- [ ] Chạy `docker-compose up -d --build`
- [ ] Đợi build xong (1-2 phút)
- [ ] Truy cập http://localhost:3000
- [ ] Đăng ký tài khoản mới
- [ ] Upload file và test

---

## 📦 Cấu trúc sau khi clone

```
hero-lab/
├── docker-compose.yml      ← File chính để chạy
├── docker/                  ← Dockerfiles
├── backend/                 ← Django backend
├── frontend/                ← Next.js frontend
├── python/                  ← Processing modules
├── fake_signal_data.txt     ← File test mẫu
└── README.md               ← Tài liệu chi tiết
```

**Không cần cài đặt gì thêm! Tất cả đã được tự động setup trong Docker.**

---

## 🎉 Xong!

Bạn đã sẵn sàng sử dụng Hero Lab!

Xem thêm:
- [README.md](./README.md) - Tài liệu đầy đủ
- [QUICK_START.md](./QUICK_START.md) - Hướng dẫn nhanh
- [docs/DATA_PROCESSING.md](./docs/DATA_PROCESSING.md) - Chi tiết xử lý dữ liệu

