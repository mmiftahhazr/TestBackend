<?php

$fileCSV = 'employees.csv';

// --- FUNGSI UNTUK MENDAPATKAN ID OTOMATIS ---
/**
 * Membaca file CSV dan mencari ID tertinggi, lalu mengembalikan ID + 1.
 * @param string $filename Nama file CSV.
 * @return int ID berikutnya yang tersedia.
 */
function getNextId($filename) {
    $maxId = 0;
    
    // Cek apakah file ada dan bisa dibaca
    if (is_readable($filename) && ($handle = fopen($filename, 'r')) !== FALSE) {
        
        // Lewati baris header pertama
        fgetcsv($handle); 

        // Loop melalui setiap baris untuk mencari ID tertinggi
        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
            // Pastikan kolom ID ada, numerik, dan lebih besar dari maxId saat ini
            if (isset($data[0]) && is_numeric($data[0])) {
                $id = (int)$data[0];
                if ($id > $maxId) {
                    $maxId = $id;
                }
            }
        }
        fclose($handle);
    }
    
    // Kembalikan ID tertinggi + 1
    return $maxId + 1;
}

// --- LOGIKA UNTUK MENYIMPAN DATA (SAAT FORM DI-SUBMIT) ---
// Cek apakah request adalah metode POST (artinya form disubmit)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // 1. Ambil data dari form
    $id = $_POST['id'];       // Ini adalah ID otomatis dari input readonly
    $nama = $_POST['nama'];
    $posisi = $_POST['posisi'];
    $gaji = $_POST['gaji'];

    // 2. Validasi sederhana (pastikan tidak ada yang kosong)
    if (!empty($id) && !empty($nama) && !empty($posisi) && !empty($gaji)) {
        
        // 3. Siapkan data baru sebagai array
        $dataBaru = [$id, $nama, $posisi, $gaji];
        
        // 4. Buka file dalam mode 'append' (tambahkan di akhir)
        if (($handle = fopen($fileCSV, 'a')) !== FALSE) {
            
            // 5. Tulis baris CSV baru
            fputcsv($handle, $dataBaru);
            fclose($handle);
        }
    }
    
    // 6. Redirect kembali ke halaman ini
    // Ini adalah trik standar untuk mencegah form terkirim ulang
    // jika pengguna me-refresh halaman (Post/Redirect/Get pattern)
    header('Location: index.php');
    exit;
}

// --- DAPATKAN ID BERIKUTNYA UNTUK DITAMPILKAN DI FORM ---
// Kita panggil fungsi ini agar variabel $nextId bisa dipakai di HTML
$nextId = getNextId($fileCSV);

?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Karyawan</title>
    <style>
        /* CSS Global */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #121212; /* Latar belakang sangat gelap */
            color: #e0e0e0;
            margin: 0;
            padding: 20px;
        }

        /* Container Utama */
        .container {
            max-width: 900px;
            margin: 20px auto;
            padding: 25px;
            background-color: #1e1e1e; /* Latar container sedikit lebih terang */
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        h2 {
            color: #00aaff; /* Warna aksen (biru cerah) */
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-top: 0;
        }

        /* --- Style Form (Bagian 15.b) --- */
        .form-section {
            margin-bottom: 40px;
        }

        form {
            /* Menggunakan CSS Grid untuk layout form yang responsif */
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px; /* Jarak antar input */
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        label {
            margin-bottom: 8px;
            font-weight: 600;
            color: #bbb;
        }

        input[type="text"],
        input[type="number"] {
            padding: 12px;
            background-color: #2a2a2a;
            border: 1px solid #444;
            color: #fff;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus {
            outline: none;
            border-color: #00aaff;
            box-shadow: 0 0 0 3px rgba(0, 170, 255, 0.2);
        }

        /* Style khusus untuk input ID yang readonly */
        input[readonly] {
            background-color: #333;
            color: #888;
            cursor: not-allowed;
        }

        button[type="submit"] {
            background-color: #007BFF;
            color: white;
            padding: 12px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: background-color 0.2s;
            /* Membuat tombol span selebar grid */
            grid-column: 1 / -1; 
        }

        button[type="submit"]:hover {
            background-color: #0056b3;
        }

        /* --- Style Tabel (Bagian 15.a) --- */
        .table-section {
            overflow-x: auto; /* Agar tabel bisa di-scroll horizontal di HP */
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background-color: #2a2a2a;
            color: #fff;
            border-radius: 8px;
            overflow: hidden; /* Penting untuk border-radius */
        }

        th, td {
            padding: 14px 18px;
            text-align: left;
            border-bottom: 1px solid #444;
        }

        thead tr {
            background-color: #333; /* Header tabel */
        }

        tbody tr:nth-child(even) {
            background-color: #252525; /* Warna zebra */
        }

        tbody tr:hover {
            background-color: #4a4a4a; /* Efek hover */
        }

        tbody tr:last-child td {
            border-bottom: none; /* Hilangkan border di baris terakhir */
        }
    </style>
</head>
<body>

    <div class="container">

        <div class="form-section">
            <h2>Tambah Karyawan Baru</h2>
            
            <form action="index.php" method="POST">
                <div class="form-group">
                    <label for="id">ID (Otomatis)</label>
                    <input type="number" id="id" name="id" value="<?php echo $nextId; ?>" readonly>
                </div>

                <div class="form-group">
                    <label for="nama">Nama:</label>
                    <input type="text" id="nama" name="nama" placeholder="Contoh: Budi Santoso" required>
                </div>

                <div class="form-group">
                    <label for="posisi">Posisi:</label>
                    <input type="text" id="posisi" name="posisi" placeholder="Contoh: Manager" required>
                </div>

                <div class="form-group">
                    <label for="gaji">Gaji:</label>
                    <input type="number" id="gaji" name="gaji" placeholder="Contoh: 5000" required>
                </div>

                <button type="submit">Simpan Karyawan</button>
            </form>
        </div>


        <div class="table-section">
            <h2>Data Karyawan Saat Ini</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Posisi</th>
                        <th>Gaji</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    // Buka file untuk dibaca
                    if (($handle = fopen($fileCSV, 'r')) !== FALSE) {
                        
                        // Lewati baris header
                        fgetcsv($handle); 

                        $baris = 0;
                        // Loop melalui sisa baris
                        while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                            echo '<tr>';
                            echo '<td>' . htmlspecialchars($data[0]) . '</td>';
                            echo '<td>' . htmlspecialchars($data[1]) . '</td>';
                            echo '<td>' . htmlspecialchars($data[2]) . '</td>';
                            echo '<td>' . htmlspecialchars($data[3]) . '</td>';
                            echo '</tr>';
                            $baris++;
                        }
                        fclose($handle);

                        // Tampilkan pesan jika file ada tapi kosong
                        if ($baris == 0) {
                             echo '<tr><td colspan="4" style="text-align:center;">Belum ada data karyawan.</td></tr>';
                        }
                        
                    } else {
                        // Tampilkan pesan jika file CSV tidak ditemukan
                        echo '<tr><td colspan="4" style="text-align:center;">Error: File ' . $fileCSV . ' tidak ditemukan.</td></tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>

    </div> </body>
</html>