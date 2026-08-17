const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke MongoDB (Ganti URL ini sama link DB lu, anjing!)
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/zenn_store?retryWrites=true&w=majority')
  .then(() => console.log('DB Connected!'))
  .catch(err => console.log(err));

// --- SCHEMA DATABASE ---

// Schema Produk
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  stock: { type: Number, default: 10 }
});
const Product = mongoose.model('Product', ProductSchema);

// Schema Cart (Keranjang Belanja)
const CartSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  totalPrice: { type: Number, default: 0 }
});
const Cart = mongoose.model('Cart', CartSchema);

// --- ROUTE API (Tempat lu interaksi) ---

// 1. Ambil semua produk
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 2. Tambah produk baru (buat admin)
app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ message: 'Produk berhasil ditambahkan, kontol!' });
});

// 3. Ambil keranjang user
app.get('/api/cart/:userId', async (req, res) => {
  let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  if (!cart) {
    cart = new Cart({ userId: req.params.userId });
    await cart.save();
  }
  res.json(cart);
});

// 4. Tambah barang ke keranjang
app.post('/api/cart/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId });
  }

  // Cek barang udah ada di keranjang belum
  const existingItem = cart.items.find(item => item.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({ productId, quantity: quantity || 1 });
  }

  // Hitung ulang total harga
  const populatedCart = await cart.populate('items.productId');
  let total = 0;
  populatedCart.items.forEach(item => {
    total += item.productId.price * item.quantity;
  });
  cart.totalPrice = total;

  await cart.save();
  res.json(cart);
});

// 5. Checkout (Hapus semua barang di keranjang, asumsi udah bayar)
app.post('/api/checkout/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.json({ message: 'Checkout berhasil, barang bakal dikirim!' });
  } else {
    res.status(404).json({ message: 'Keranjang kosong, tolol!' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}, siap ngacak!`);
});
