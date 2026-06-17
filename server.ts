import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock database for user balance
let userBalance = 0.0;

// API Routes
app.get("/api/user/balance", (req, res) => {
  res.json({ balance: userBalance });
});

// Create Payment Intent
app.post("/api/payment/create", async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const brandKey = process.env.PAY_SECURE_BRAND_KEY;
    const gatewayUrl = process.env.PAY_SECURE_URL;

    if (!brandKey) {
      return res.status(500).json({ error: "Server configuration error: Brand Key is missing" });
    }

    // According to the user, we need to redirect to their gateway.
    // Usually these gateways have a specific endpoint to initiate payment.
    // Since we don't have the exact API spec, we'll try to build a standard URL.
    // Many SMM panel gateways use a structure like this for direct redirection:
    // https://gateway.com/pay/BRAND_KEY?amount=100&success_url=...&fail_url=...
    
    // However, the best way for a "Secure" gateway is a POST request that returns a URL.
    // If we assume it's a redirect-based one as the user's description suggests ("ক্লিক করলে নিয়ে যাবে"),
    // we'll return the constructed URL.
    
    const successUrl = `${req.protocol}://${req.get("host")}/api/payment/success?amount=${amount}`;
    const failUrl = `${req.protocol}://${req.get("host")}/api/payment/fail`;

    // Constructing a likely URL structure for this specific gateway
    // NOTE: This structure is an educated guess based on djsmmbd's custom pay-secure portal.
    const paymentUrl = `${gatewayUrl}/api/pay/${brandKey}?amount=${amount}&success_url=${encodeURIComponent(successUrl)}&fail_url=${encodeURIComponent(failUrl)}`;

    res.json({ url: paymentUrl });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Success Callback
app.get("/api/payment/success", (req, res) => {
  const amount = Number(req.query.amount);
  if (!isNaN(amount) && amount > 0) {
    userBalance += amount;
    console.log(`Updated balance: ${userBalance}`);
  }
  
  // Redirect back to the frontend dashboard or history tab
  res.redirect("/?status=success&tab=deposit");
});

// Fail Callback
app.get("/api/payment/fail", (req, res) => {
  res.redirect("/?status=fail&tab=deposit");
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
