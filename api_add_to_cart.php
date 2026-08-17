<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_id'])) {
    $product_id = $_POST['product_id'];
    
    // Inisialisasi cart kalau belum ada
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    // Cek barang udah ada di cart belum
    if (isset($_SESSION['cart'][$product_id])) {
        $_SESSION['cart'][$product_id]['quantity']++;
    } else {
        $_SESSION['cart'][$product_id] = ['id' => $product_id, 'quantity' => 1];
    }

    // Lempar balik ke halaman utama
    header('Location: index.php');
    exit();
} else {
    header('Location: index.php');
    exit();
}
?>
