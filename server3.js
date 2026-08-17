const stripe = require('stripe')('sk_test_...'); // Ganti pake Secret Key Stripe lu

// --- PAYMENT ROUTES ---

// 1. Buat Payment Intent (Persiapan pembayaran dari frontend)
app.post('/api/payment/create-intent', async (req, res) => {
  const { amount, currency = 'usd' } = req.body; // amount dalam cent (misal $50 = 5000)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Webhook Stripe (Otomatis update status pesanan kalau udah bayar)
// Ini endpoint yang dipanggil Stripe pas pembayaran sukses
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_...'); // Ganti Webhook Secret
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Logic lu di sini: update status order di DB jadi "PAID", kurangi stok barang, dll.
    console.log(`Payment sukses buat ID: ${paymentIntent.id}`);
  }

  res.json({received: true});
});
