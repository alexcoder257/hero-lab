# 🔐 Thông tin tài khoản mặc định

## Tài khoản Admin mặc định

Khi chạy hệ thống lần đầu, tài khoản admin sẽ được tự động tạo:

- **Email**: `admin@hero-lab.com`
- **Username**: `admin`
- **Password**: `1234`

## Cách đăng nhập

1. Truy cập http://localhost:3000/login
2. Nhập email: `admin@hero-lab.com`
3. Nhập password: `1234`
4. Click "Login"

## Lưu ý

- Tài khoản này được tạo tự động khi container backend start lần đầu
- Nếu tài khoản đã tồn tại, script sẽ không tạo lại
- Bạn có thể đăng ký tài khoản mới tại trang Register

## Thay đổi thông tin đăng nhập

Nếu muốn thay đổi email/password mặc định, sửa file:
- `backend/create_admin.py`

Sau đó rebuild container:
```bash
docker-compose down
docker-compose up -d --build
```

