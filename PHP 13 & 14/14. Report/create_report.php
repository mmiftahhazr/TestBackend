<?php

date_default_timezone_set('Asia/Jakarta');

$aktivitas = [
    'User_Login'  => 'John Doe',
    'User_Logout' => 'John Doe',
    'User_Login'  => 'Jane Smith'
];

$jumlahAktivitas = count($aktivitas);

$tanggalSekarang = date('d F Y');

$konten = "Laporan Harian\n";
$konten .= "Tanggal : $tanggalSekarang\n";
$konten .= "Total Aktivitas : $jumlahAktivitas";

$fileOutput = 'report.txt';
$hasil = file_put_contents($fileOutput, $konten);

if ($hasil !== false) {
    echo "File '$fileOutput' berhasil dibuat.";
} else {
    echo "Error: Gagal menulis ke file '$fileOutput'.";
}

?>