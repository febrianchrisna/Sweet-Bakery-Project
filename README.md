# Sweet Bakery - Sistem Manajemen Toko Roti Online

Proyek Sweet Bakery adalah aplikasi web full-stack untuk manajemen toko roti online yang dibangun menggunakan React.js untuk frontend dan Node.js dengan Express untuk backend.

## 📋 Fitur Utama

- **Autentikasi Pengguna**: Login, register, dan manajemen sesi
- **Katalog Produk**: Menampilkan produk roti dengan kategori dan pencarian
- **Keranjang Belanja**: Menambah, mengedit, dan menghapus item
- **Sistem Pemesanan**: Checkout dan tracking status pesanan
- **Dashboard Admin**: Manajemen produk dan pesanan
- **Responsive Design**: Tampilan yang optimal di semua perangkat

## 🚀 Teknologi yang Digunakan

### Frontend
- React.js 18
- React Router DOM
- Context API untuk state management
- CSS3 dengan design modern

### Backend
- Node.js dengan Express.js
- MySQL dengan Sequelize ORM
- JWT untuk autentikasi
- bcrypt untuk enkripsi password
- CORS untuk cross-origin requests

## 📚 Dokumentasi API

### Base URL
```
Development: http://localhost:5000
Production: https://bakery-be-663618957788.us-central1.run.app
```

---

## 🔐 Endpoint Autentikasi

| Method | Endpoint | Autentikasi | Deskripsi |
|--------|----------|-------------|-----------|
| POST | `/register` | Tidak | Mendaftarkan pengguna baru (customer/admin) |
| POST | `/login` | Tidak | Masuk ke sistem dan mendapatkan access token |
| GET | `/logout` | Bearer Token | Keluar dari sistem dan menghapus refresh token |
| GET | `/token` | Refresh Token | Memperbarui access token menggunakan refresh token |
| GET | `/users` | Admin | Mendapatkan daftar semua pengguna |



---

## 🍞 Endpoint Produk

| Method | Endpoint | Autentikasi | Deskripsi |
|--------|----------|-------------|-----------|
| GET | `/products` | Tidak | Mendapatkan semua produk dengan filter opsional |
| GET | `/products/:id` | Tidak | Mendapatkan detail produk berdasarkan ID |
| GET | `/products/categories` | Tidak | Mendapatkan daftar kategori produk |
| POST | `/products` | Admin | Menambahkan produk baru |
| PUT | `/products/:id` | Admin | Mengupdate informasi produk |
| DELETE | `/products/:id` | Admin | Menghapus produk |

### Query Parameters untuk GET /products
- `category`: Filter berdasarkan kategori (Bread, Cake, Pastry, Cookies, Dessert)
- `featured`: Filter produk unggulan (true/false)
- `search`: Pencarian berdasarkan nama produk

### Contoh Request

**POST /products**
```json
{
  "name": "Chocolate Croissant",
  "description": "Croissant mentega dengan isian cokelat",
  "price": 15000,
  "category": "Pastry",
  "featured": true,
  "stock": 20,
  "image": "chocolate-croissant.jpg"
}
```

---

## 📦 Endpoint Pesanan

| Method | Endpoint | Autentikasi | Deskripsi |
|--------|----------|-------------|-----------|
| GET | `/orders` | Admin | Mendapatkan semua pesanan (khusus admin) |
| GET | `/user/orders` | User | Mendapatkan pesanan milik pengguna yang login |
| GET | `/orders/:id` | User/Admin | Mendapatkan detail pesanan berdasarkan ID |
| POST | `/orders` | User | Membuat pesanan baru |
| PUT | `/orders/:id/status` | Admin | Mengupdate status pesanan (admin) |
| PUT | `/user/orders/:id/cancel` | User | Membatalkan pesanan (status pending saja) |
| PUT | `/user/orders/:id` | User/Admin | Mengupdate detail pesanan |
| DELETE | `/user/orders/:id` | User/Admin | Menghapus pesanan |

### Status Pesanan
- `pending`: Pesanan baru menunggu konfirmasi
- `processing`: Pesanan sedang diproses
- `completed`: Pesanan selesai
- `cancelled`: Pesanan dibatalkan

### Contoh Request

**POST /orders**
```json
{
  "items": [
    {"productId": 1, "quantity": 2},
    {"productId": 3, "quantity": 1}
  ],
  "shipping_address": "Jl. Contoh No. 123, Jakarta",
  "payment_method": "Cash on Delivery"
}
```

**PUT /orders/:id/status**
```json
{
  "status": "processing"
}
```

---

## 🛡️ Middleware Autentikasi

### Bearer Token
Semua endpoint yang memerlukan autentikasi harus menyertakan header:
```
Authorization: Bearer <access_token>
```

### Role-based Access
- **Admin**: Akses penuh ke semua endpoint
- **Customer**: Akses terbatas ke data milik sendiri
- **Public**: Akses ke produk dan kategori saja

---

## 📊 Response Format

### Success Response
```json
{
  "status": "Success",
  "message": "Operasi berhasil",
  "data": {
    // data response
  }
}
```

### Error Response
```json
{
  "status": "Error",
  "message": "Pesan error yang deskriptif"
}
```

### HTTP Status Codes
- `200`: OK - Request berhasil
- `201`: Created - Resource baru berhasil dibuat
- `400`: Bad Request - Request tidak valid
- `401`: Unauthorized - Token tidak valid atau tidak ada
- `403`: Forbidden - Tidak memiliki akses
- `404`: Not Found - Resource tidak ditemukan
- `500`: Internal Server Error - Error server

---

## 🔧 Health Check

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/health` | Mengecek status server |

Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🚀 Cara Menjalankan Project

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm atau yarn

### Setup Backend
1. Masuk ke folder backend
2. Install dependencies: `npm install`
3. Setup file `.env` dengan konfigurasi database dan JWT secrets
4. Jalankan server: `npm start`

### Setup Frontend
1. Masuk ke folder frontend
2. Install dependencies: `npm install`
3. Setup file `.env` dengan URL backend
4. Jalankan aplikasi: `npm start`

---

## 🌐 Deployment

- **Frontend**: Deployed di Google App Engine
- **Backend**: Deployed di Google Cloud Run
- **Database**: Google Cloud SQL (MySQL)

---

## 📝 Catatan Pengembangan

### Database Schema
- **Users**: id, email, username, password, role, refresh_token
- **Products**: id, name, description, price, category, stock, featured, image
- **Orders**: id, userId, total_amount, status, shipping_address, payment_method
- **OrderDetails**: id, orderId, productId, quantity, price, subtotal

### Fitur Keamanan
- Password di-hash menggunakan bcrypt
- JWT token dengan expiry time
- CORS configuration untuk security
- Input validation dan sanitization
- Role-based access control

---

## 🤝 Kontribusi

Proyek ini dikembangkan sebagai tugas praktikum TCC. Untuk kontribusi atau pertanyaan, silakan hubungi tim pengembang.
