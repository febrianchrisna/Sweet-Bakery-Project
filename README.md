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
Development: https://frontend-bakery-dot-g-09-450802.uc.r.appspot.com
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