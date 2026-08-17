<?php
$host = 'localhost';
$dbname = 'zenn_store';
$username = 'root'; // Ganti sesuai hosting lu
$password = '';     // Ganti sesuai password MySQL lu

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    session_start();
} catch (PDOException $e) {
    die("Koneksi database gagal, tolol! " . $e->getMessage());
}
?>
