import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import axios from "axios";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

dotenv.config();

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: "concentrated-flash-3cf5x",
  });
}
const db = getFirestore();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get("/api/user/balance", async (req, res) => {
  const telegramId = req.query.telegramId as string;
  if (!telegramId) return res.json({ balance: 0 });

  try {
    const userDoc = await db.collection('users').doc(telegramId).get();
    if (userDoc.exists) {
      res.json({ balance: userDoc.data()?.balance || 0 });
    } else {
      res.json({ balance: 0 });
    }
  } catch (error) {
    console.error("Balance fetch error:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

app.post("/api/user/sync", async (req, res) => {
  const { id, username, first_name } = req.body;
  if (!id) return res.status(400).json({ error: "ID is required" });

  try {
    const userRef = db.collection('users').doc(String(id));
    const userDoc = await userRef.get();

    const isAdmin = username === 'TRADER_TAMIM_3' || username === '@TRADER_TAMIM_3';

    if (!userDoc.exists) {
      await userRef.set({
        telegramId: String(id),
        username: username || '',
        firstName: first_name || '',
        balance: 0,
        isAdmin: isAdmin,
        createdAt: FieldValue.serverTimestamp()
      });
    } else {
      // Update username if it changed
      await userRef.update({
        username: username || '',
        firstName: first_name || '',
        isAdmin: isAdmin // Keep it updated in case they change username to/from admin (for dev purposes)
      });
    }
    const updatedDoc = await userRef.get();
    res.json(updatedDoc.data());
  } catch (error) {
    console.error("User sync error:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

// Admin endpoints
app.post("/api/admin/settings", async (req, res) => {
  const { telegramId, settings } = req.body;
  if (!telegramId) return res.status(400).json({ error: "ID required" });

  try {
    const userDoc = await db.collection('users').doc(String(telegramId)).get();
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await db.collection('settings').doc('global').set(settings, { merge: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Admin settings error:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

app.get("/api/admin/config", async (req, res) => {
  try {
    const settingsDoc = await db.collection('settings').doc('global').get();
    res.json(settingsDoc.data() || {});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch config" });
  }
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
    const successUrl = `${req.protocol}://${req.get("host")}/api/payment/success?amount=${amount}&trxid={transaction_id}&userId=${req.body.userId}`;
    const failUrl = `${req.protocol}://${req.get("host")}/api/payment/fail?userId=${req.body.userId}`;

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
  const userId = req.query.userId as string;

  if (!userId) return res.redirect("/?status=fail&reason=missing_user");

  const creditUser = async (amt: number) => {
    if (isNaN(amt) || amt <= 0) return;
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      balance: FieldValue.increment(amt)
    });
    console.log(`Credited ${amt} to user ${userId}`);
  };

  if (!transactionId || transactionId === "{transaction_id}") {
    console.log("No transaction ID provided or placeholder remains");
    await creditUser(amount);
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
    if (response.data && (response.data.status === 1 || response.data.status === 'success')) {
      await creditUser(amount);
      res.redirect("/?status=success&tab=deposit");
    } else {
      console.error("Payment verification failed:", response.data);
      res.redirect("/?status=fail&tab=deposit&reason=verification_failed");
    }
  } catch (error) {
    console.error("Verification error:", error);
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
