# 🚀 Quick Start Guide - Hero Lab

## Chạy toàn bộ hệ thống chỉ với 1 lệnh!

### Yêu cầu
- Docker và Docker Compose đã được cài đặt
- Kiểm tra: `docker --version` và `docker-compose --version`

### Cách chạy

#### 1. Chạy tất cả services (Frontend + Backend)

```bash
docker-compose up --build
```

Lệnh này sẽ:
- Build Docker images cho backend và frontend
- Chạy migrations database
- Start Django backend server (port 8000)
- Start Next.js frontend server (port 3000)

#### 2. Chạy ở background (detached mode)

```bash
docker-compose up -d --build
```

#### 3. Xem logs

```bash
# Xem tất cả logs
docker-compose logs -f

# Xem logs của backend
docker-compose logs -f backend

# Xem logs của frontend
docker-compose logs -f frontend
```

#### 4. Dừng services

```bash
docker-compose down
```

#### 5. Dừng và xóa volumes (xóa database)

```bash
docker-compose down -v
```

---

## 🌐 Truy cập ứng dụng

Sau khi chạy `docker-compose up`, truy cập:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin (nếu đã tạo superuser)

---

## 📝 Lần đầu chạy

### Tạo superuser (tùy chọn)

```bash
docker-compose exec backend python manage.py createsuperuser
```

Hoặc đăng ký user mới qua frontend tại http://localhost:3000/register

---

## 🔧 Troubleshooting

### Port đã được sử dụng

**Lỗi**: `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Giải pháp nhanh**:
```bash
# Dừng containers cũ
docker-compose down

# Kill process đang dùng port
lsof -ti :8000 | xargs kill -9
lsof -ti :3000 | xargs kill -9

# Hoặc dùng script tự động
./fix-port.sh

# Chạy lại
docker-compose up -d --build
```

**Hoặc thay đổi port** trong `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Thay đổi port bên trái
  - "3001:3000"
```

Xem chi tiết tại [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Rebuild lại images

```bash
docker-compose build --no-cache
docker-compose up
```

### Xem status containers

```bash
docker-compose ps
```

### Restart một service

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Vào trong container

```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

---

## 📦 Cấu trúc Docker

```
hero-lab/
├── docker-compose.yml      # Main compose file
├── docker/
│   ├── Dockerfile.backend  # Backend image
│   └── Dockerfile.frontend # Frontend image
└── .dockerignore          # Files to ignore
```

---

## 🎯 Workflow

1. **Development**: Sử dụng `docker-compose up` để hot-reload
2. **Production**: Build và chạy production images

---

**Chỉ cần 1 lệnh: `docker-compose up --build` và bạn đã có toàn bộ hệ thống! 🎉**

