const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- SCHEMA USER ---
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' } // user / admin
});
const User = mongoose.model('User', UserSchema);

const SECRET_KEY = "SUPER_SECRET_KEY_LU_SENDIRI_ANJING"; // Ganti ini

// --- AUTH ROUTES ---

// 1. Register (Daftar akun)
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Cek email udah dipake belum
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email udah dipake, tolol!" });

  // Hash password (biar gak bocor mentah)
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  
  res.json({ message: "Akun berhasil dibuat, selamat datang bos!" });
});

// 2. Login (Masuk)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email atau password salah, goblok!" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Password salah, anjing!" });

  // Bikin JWT Token
  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
});

// Middleware buat ngecek token (buat akses halaman admin)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: "Token gak ada, login dulu kampret!" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token kadaluarsa atau palsu!" });
    req.user = user;
    next();
  });
};

// Contoh route admin yang dilindungi
app.get('/api/admin/dashboard', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Lu bukan admin, jangan ngacak!" });
  res.json({ message: "Selamat datang Admin, lu bisa ngapain aja di sini!" });
});
