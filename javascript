// Saat user klik Checkout
const handleCheckout = async () => {
  const response = await fetch('http://localhost:5000/api/payment/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 5000 }) // Total harga dalam sen
  });
  const { clientSecret } = await response.json();

  // Pake library @stripe/stripe-js di frontend buat nampilin form kartu kredit
  // confirmPayment(clientSecret); 
};
