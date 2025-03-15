# RabbitMQ User Registration System

Sistem ini adalah implementasi **RabbitMQ** untuk proses registrasi user menggunakan **Node.js, Express, Prisma, dan PostgreSQL** . Sistem ini terdiri dari dua bagian utama:

1. **Producer** (API yang menerima request dan mengirim pesan ke RabbitMQ)
2. **Consumer** (Menerima pesan dari RabbitMQ dan menyimpannya ke database PostgreSQL)

## 📂 Struktur Proyek
```
/rabbitmq-project
│── /producer
│   ├── producer.js
│   ├── server.js
│   ├── package.json
│── /consumer
│   ├── consumer.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   ├── package.json
│── .env
│── README.md
```

## ⚙️ Teknologi yang Digunakan
- **Node.js** (Express.js)
- **RabbitMQ** (Message Broker)
- **Prisma** (ORM untuk PostgreSQL)
- **PostgreSQL** (Database)

## 🚀 Instalasi & Konfigurasi
### 1️⃣ Setup RabbitMQ
Pastikan **RabbitMQ** sudah terinstal dan berjalan di sistem lokal:
```sh
rabbitmq-server
```

### 2️⃣ Clone Repository
```sh
git clone <repository-url>
cd rabbitmq-project
```

### 3️⃣ Setup Consumer (Database & Prisma)
Masuk ke folder `consumer/`, lalu:
```sh
cd consumer
npm install
npx prisma migrate dev --name init
```

Buat file `.env` di **consumer/** dan atur koneksi database PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rabbitmq_db"
```

### 4️⃣ Setup Producer (Express API)
Masuk ke folder `producer/`, lalu:
```sh
cd producer
npm install
```

### 5️⃣ Jalankan Aplikasi
#### 🔹 Jalankan Consumer terlebih dahulu:
```sh
cd consumer
node consumer.js
```

#### 🔹 Jalankan Producer (API):
```sh
cd producer
node server.js
```

## 📌 Cara Penggunaan
Gunakan **Postman** atau `curl` untuk mengirim request registrasi:
```sh
curl -X POST http://localhost:3000/register \  
     -H "Content-Type: application/json" \  
     -d '{"name": "John Doe", "email": "john@example.com", "password": "secret"}'
```

Jika berhasil:
```json
{
  "message": "User registration queued"
}
```

Untuk melihat data yang sudah tersimpan, gunakan:
```sh
npx prisma studio
```

## 📊 Flow Sistem
1. **User mengirim data registrasi** ke Producer.
2. **Producer** memvalidasi data dan mengirim pesan ke **RabbitMQ queue**.
3. **Consumer** mengambil pesan dari queue dan menyimpan user ke **PostgreSQL**.
4. **Consumer** mengirimkan **acknowledgment (ACK)** agar pesan dihapus dari queue.

## ❓ Troubleshooting
| Kasus | Penyebab | Solusi |
|-------|---------|--------|
| **Pesan tidak terkirim ke RabbitMQ** | RabbitMQ tidak berjalan | Jalankan `rabbitmq-server` |
| **Consumer tidak menyimpan data** | Kesalahan koneksi database | Periksa `.env` dan koneksi PostgreSQL |
| **Pesan tidak diproses** | Consumer tidak aktif | Jalankan `node consumer.js` |

## 🎯 Kesimpulan
- **Producer** menangani request user dan mengirim pesan ke RabbitMQ.
- **Consumer** mengambil pesan dan menyimpannya ke PostgreSQL.
- **RabbitMQ** memastikan pesan tidak hilang jika sistem mengalami gangguan.

💡 Sistem ini **scalable, reliable, dan mendukung asynchronous processing**.

---
**🚀 Happy Coding!**

