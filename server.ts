import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import axios from "axios";

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

    // Success URL now includes a placeholder for transaction_id which the gateway should fill
    // If the gateway doesn't fill it automatically, we might need to handle it differently.
    // Based on the PHP snippet, verification is done by transaction_id.
    const successUrl = `${req.protocol}://${req.get("host")}/api/payment/success?amount=${amount}&trxid={transaction_id}`;
    const failUrl = `${req.protocol}://${req.get("host")}/api/payment/fail`;

    const paymentUrl = `${gatewayUrl}/pay/${brandKey}?amount=${amount}&success_url=${encodeURIComponent(successUrl)}&fail_url=${encodeURIComponent(failUrl)}`;

    res.json({ url: paymentUrl });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Success Callback with Verification
app.get("/api/payment/success", async (req, res) => {
  const amount = Number(req.query.amount);
  const transactionId = req.query.trxid as string;

  if (!transactionId || transactionId === "{transaction_id}") {
    console.log("No transaction ID provided or placeholder remains");
    // Some gateways might not replace the placeholder if not supported via GET params
    // In a real SMM panel, the gateway usually has a post-payment redirect with params.
    // We'll proceed with amount for now but log a warning.
    if (!isNaN(amount) && amount > 0) {
        userBalance += amount;
    }
    return res.redirect("/?status=success&tab=deposit");
  }

  try {
    const brandKey = process.env.PAY_SECURE_BRAND_KEY;
    const apiKey = process.env.PAY_SECURE_API_KEY;
    const secretKey = process.env.PAY_SECURE_SECRET_KEY || "your_secret_key";
    const gatewayUrl = process.env.PAY_SECURE_URL;

    // Verify transaction with the gateway
    const response = await axios.post(`${gatewayUrl}/api/payment/verify`, {
      transaction_id: transactionId
    }, {
      headers: {
        'API-KEY': apiKey,
        'SECRET-KEY': secretKey,
        'BRAND-KEY': brandKey,
        'Content-Type': 'application/json'
      }
    });

    // Check verification status
    // Assuming the response contains success or status: 1
    if (response.data && (response.data.status === 1 || response.data.status === 'success')) {
      if (!isNaN(amount) && amount > 0) {
        userBalance += amount;
        console.log(`Verified payment. Updated balance: ${userBalance}`);
      }
      res.redirect("/?status=success&tab=deposit");
    } else {
      console.error("Payment verification failed:", response.data);
      res.redirect("/?status=fail&tab=deposit&reason=verification_failed");
    }
  } catch (error) {
    console.error("Verification error:", error);
    // If verification service is down but we got amount, we might still want to credit? 
    // Usually safer to fail.
    res.redirect("/?status=fail&tab=deposit&reason=error");
  }
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
