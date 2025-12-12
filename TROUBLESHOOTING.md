# 🔧 Troubleshooting - Hero Lab

## Port đã được sử dụng

### Lỗi: "port is already allocated" hoặc "Bind for 0.0.0.0:8000 failed"

### Giải pháp 1: Dừng containers cũ

```bash
# Dừng và xóa containers
docker-compose down

# Xóa containers cũ (nếu có)
docker ps -a | grep hero-lab | awk '{print $1}' | xargs docker rm -f
```

### Giải pháp 2: Kill process đang dùng port

```bash
# Tìm process đang dùng port 8000
lsof -i :8000

# Kill process (thay PID bằng process ID từ lệnh trên)
kill -9 <PID>

# Hoặc kill tất cả
lsof -ti :8000 | xargs kill -9
```

### Giải pháp 3: Dùng script tự động

```bash
./fix-port.sh
```

### Giải pháp 4: Thay đổi port

Sửa trong `docker-compose.yml` hoặc dùng environment variable:

```bash
# Thay đổi port backend sang 8001
BACKEND_PORT=8001 FRONTEND_PORT=3001 docker-compose up -d --build
```

Sau đó truy cập:
- Frontend: http://localhost:3001
- Backend: http://localhost:8001

**Lưu ý**: Nếu đổi port backend, cần cập nhật `NEXT_PUBLIC_API_URL` trong frontend:

```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## Container không start

### Kiểm tra logs

```bash
docker-compose logs backend
docker-compose logs frontend
```

### Rebuild lại

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Database migration errors

### Reset database

```bash
# Xóa database và volumes
docker-compose down -v

# Chạy lại
docker-compose up -d --build
```

---

## Frontend không connect được backend

### Kiểm tra backend đã chạy chưa

```bash
curl http://localhost:8000/admin/
```

### Kiểm tra CORS settings

Đảm bảo trong `docker-compose.yml`:
```yaml
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## Build errors

### Clear Docker cache

```bash
docker system prune -a
docker-compose build --no-cache
```

### Kiểm tra disk space

```bash
docker system df
```

---

## Container bị stuck

### Restart tất cả

```bash
docker-compose restart
```

### Force recreate

```bash
docker-compose up -d --force-recreate
```

---

## Kiểm tra status

```bash
# Xem containers đang chạy
docker-compose ps

# Xem logs real-time
docker-compose logs -f

# Xem resource usage
docker stats
```

---

## Common Commands

```bash
# Stop everything
docker-compose down

# Stop and remove volumes (delete data)
docker-compose down -v

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

