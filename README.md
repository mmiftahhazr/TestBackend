# Test Backend

Repository ini berisi aplikasi backend sederhana dengan Node.js dan beserta frontend statis dan script PHP untuk keperluan Test Backend Web Programmer.

## Deskripsi Singkat

- **Autentikasi JWT**: Register & login user, proteksi endpoint.
- **CRUD Produk**: Tambah, edit, hapus, dan cari produk.
- **Transaksi Penjualan**: Catat penjualan produk, update stok otomatis.
- **Dashboard**: Lihat 5 produk terlaris.
- **Frontend Sederhana**: Aplikasi sederhana dengan HTML, CSS, dan JavaScript.

## Struktur Project

- `server.js` — Entry point backend Express
- `config/database.js` — Koneksi Sequelize ke MySQL
- `controllers/` — Logika register/login, produk, dashboard, transaksi
- `models/` — Model Sequelize untuk User & Product
- `routes/` — Routing Express (auth & produk)
- `middleware/authMiddleware.js` — Middleware validasi JWT
- `frontend/` — Aplikasi web sederhana (HTML, CSS, JS)

## Instalasi & Menjalankan

1. **Clone repo & install dependencies**
   ```bash
   npm install
   ```
2. **Buat file `.env`** (lihat contoh di bawah)
3. **Jalankan MySQL & buat database**
   - Nama database: `penjualan`
   - Pastikan stored procedure `sp_create_sale` dan `get_top_product` sudah ada
4. **Jalankan server**
   ```bash
   node server.js
   ```
5. **Buka frontend**
   - Buka `frontend/index.html` di browser

## Contoh `.env`

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=penjualan
JWT_SECRET=rahasia_yang_sangat_sulit_ditebak
```

## Endpoint API

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user (dapatkan JWT)
- `GET /api/products` — List produk (dengan filter & pagination)
- `POST /api/products` — Tambah produk
- `PUT /api/products/:id` — Edit produk
- `DELETE /api/products/:id` — Hapus produk
- `POST /api/sales` — Catat transaksi penjualan
- `GET /api/dashboard/top-products` — 5 produk terlaris

## Catatan

- Pastikan stored procedure MySQL berikut tersedia:
  - `sp_create_sale` (untuk transaksi & update stok)
  - `get_top_product` (untuk dashboard)
- Token JWT wajib untuk akses endpoint produk, transaksi, dan dashboard.

---

**Author:** Muhamad Miftah
