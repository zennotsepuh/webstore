<?php
require 'db_connect.php';

// Ambil produk dari database
$stmt = $pdo->query("SELECT * FROM products");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZENN Store - PHP Version</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-900">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <div class="font-bold text-2xl tracking-tight">ZENN</div>
            <div class="flex items-center space-x-4">
                <a href="cart.php" class="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">Cart (<?php echo count($_SESSION['cart'] ?? []); ?>)</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-white py-16 px-4 sm:py-24 max-w-7xl mx-auto lg:flex lg:justify-between lg:items-center">
        <div class="max-w-xl lg:max-w-lg">
            <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Style That <br /> Speaks Volumes.</h1>
            <p class="mt-4 text-lg text-gray-500">Premium gear for the modern hustler.</p>
            <div class="mt-6">
                <a href="#products" class="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-800">Shop Now</a>
            </div>
        </div>
        <div class="mt-10 lg:mt-0 lg:ml-10">
            <img class="rounded-lg shadow-xl" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="Hero" width="500">
        </div>
    </section>

    <!-- Product Grid -->
    <section id="products" class="py-12 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <?php if (count($products) > 0): ?>
                <?php foreach ($products as $p): ?>
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                        <div class="h-64 w-full bg-gray-200 relative">
                            <img src="<?php echo $p['image']; ?>" alt="<?php echo $p['name']; ?>" class="w-full h-full object-cover">
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900"><?php echo $p['name']; ?></h3>
                            <p class="mt-1 text-xl font-bold text-gray-900">$<?php echo number_format($p['price'], 2); ?></p>
                            <form action="api_add_to_cart.php" method="POST">
                                <input type="hidden" name="product_id" value="<?php echo $p['id']; ?>">
                                <button type="submit" class="mt-3 w-full bg-black text-white py-2 rounded-full text-sm hover:bg-gray-800">Add to Cart</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="text-gray-500">Belum ada produk, bos. Masukin dulu ke database.</p>
            <?php endif; ?>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-10 px-4 max-w-7xl mx-auto">
        <p class="text-center text-sm text-gray-400">&copy; 2026 ZENN Store. PHP Version by DanzModss.</p>
    </footer>
</body>
</html>
