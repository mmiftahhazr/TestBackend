<?php

$fileInput = 'input.txt';
$fileOutput = 'output.txt';

$daftarNama = file($fileInput, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

if ($daftarNama === false) {
    echo "Error: Gagal membaca file '$fileInput'. Pastikan file tersebut ada.";
} else {
    
    sort($daftarNama);

    $hasilUrut = implode("\n", $daftarNama);

    $bytesWritten = file_put_contents($fileOutput, $hasilUrut);

    if ($bytesWritten !== false) {
        echo "Berhasil! Nama-nama telah diurutkan dan disimpan ke '$fileOutput'.";
    } else {
        echo "Error: Gagal menulis ke file '$fileOutput'.";
    }
}

?>