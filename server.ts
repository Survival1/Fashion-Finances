import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface ScheduledOrder {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  entryFee: number;
  dateTime: string;       // ISO String of target execution date/time
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  projectId: string;
  projectName: string;
  status: 'pending' | 'executed' | 'applied' | 'cancelled';
  executedAt?: string;
  appliedAt?: string;
}

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "scheduled_orders.json");

// Helper to load orders from disk
function loadOrders(): ScheduledOrder[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading scheduled_orders.json:", err);
  }
  return [];
}

// Helper to save orders to disk
function saveOrders(orders: ScheduledOrder[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing scheduled_orders.json:", err);
  }
}

// Initialize seed orders if file is empty
if (!fs.existsSync(DB_FILE)) {
  const initialSeeds: ScheduledOrder[] = [
    {
      id: "sch-seed-1",
      userId: "user-buyer-1",
      userName: "Tú",
      userAvatar: "",
      entryFee: 1000,
      dateTime: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
      recurrence: "weekly",
      projectId: "proj-1",
      projectName: "Milano Vintage Denim",
      status: "pending"
    }
  ];
  saveOrders(initialSeeds);
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  app.use(express.json({ limit: '100mb' }));
  app.use(express.raw({ type: ['video/*', 'application/octet-stream'], limit: '150mb' }));

  // Static serving for public directory
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  app.use(express.static(publicDir));

  // Background executions queue monitor (ticks every 5 seconds)
  setInterval(() => {
    const orders = loadOrders();
    const now = new Date();
    let hasChanges = false;

    orders.forEach((order) => {
      if (order.status === "pending" && new Date(order.dateTime) <= now) {
        order.status = "executed";
        order.executedAt = now.toISOString();
        hasChanges = true;
        console.log(`[Auto-Investor Queue] Executing Order id: ${order.id} for amount: ${order.entryFee}€`);

        // If it was a recurring order, spawn the next execution task automatically
        if (order.recurrence !== "none") {
          const nextDate = new Date(order.dateTime);
          if (order.recurrence === "daily") {
            nextDate.setDate(nextDate.getDate() + 1);
          } else if (order.recurrence === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (order.recurrence === "monthly") {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }

          const nextOrder: ScheduledOrder = {
            id: `sch-rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userId: order.userId,
            userName: order.userName,
            userAvatar: order.userAvatar,
            entryFee: order.entryFee,
            dateTime: nextDate.toISOString(),
            recurrence: order.recurrence,
            projectId: order.projectId,
            projectName: order.projectName,
            status: "pending"
          };
          orders.push(nextOrder);
          console.log(`[Auto-Investor Queue] Automatically created next recurring execution set for ${nextOrder.dateTime}`);
        }
      }
    });

    if (hasChanges) {
      saveOrders(orders);
    }
  }, 5000);

  // --- API ENDPOINTS ---

  // Get list of scheduled orders
  app.get("/api/scheduled-orders", (req, res) => {
    res.json(loadOrders());
  });

  // Create a new scheduled order rule
  app.post("/api/scheduled-orders", (req, res) => {
    const { userId, userName, userAvatar, entryFee, dateTime, recurrence, projectId, projectName } = req.body;
    
    if (!userId || !entryFee || !dateTime || !recurrence || !projectId || !projectName) {
      res.status(400).json({ error: "Missing required parameters for scheduling." });
      return;
    }

    const orders = loadOrders();
    const newOrder: ScheduledOrder = {
      id: `sch-usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userName: userName || "Usuario",
      userAvatar: userAvatar || "",
      entryFee: Number(entryFee),
      dateTime: new Date(dateTime).toISOString(),
      recurrence,
      projectId,
      projectName,
      status: "pending"
    };

    orders.push(newOrder);
    saveOrders(orders);
    console.log(`[API] Created new investment schedule: ${newOrder.entryFee}€ on ${newOrder.dateTime}`);
    res.json({ success: true, order: newOrder });
  });

  // Cancel/Delete a scheduled order
  app.delete("/api/scheduled-orders/:id", (req, res) => {
    const { id } = req.params;
    let orders = loadOrders();
    const target = orders.find(o => o.id === id);

    if (!target) {
      res.status(404).json({ error: "Scheduled order not found." });
      return;
    }

    if (target.status === "pending") {
      target.status = "cancelled";
      saveOrders(orders);
      res.json({ success: true, message: "Order cancelled successfully.", order: target });
    } else {
      // permanently remove non-pending orders to clean logs
      orders = orders.filter(o => o.id !== id);
      saveOrders(orders);
      res.json({ success: true, message: "Registry removed." });
    }
  });

  // Forzar trigger instantáneo de un pedido programado para tests inmediatos!
  app.post("/api/scheduled-orders/:id/trigger", (req, res) => {
    const { id } = req.params;
    const orders = loadOrders();
    const order = orders.find(o => o.id === id);

    if (!order) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    if (order.status !== "pending") {
      res.status(400).json({ error: "Only pending tasks can be forced." });
      return;
    }

    order.status = "executed";
    order.executedAt = new Date().toISOString();

    // Spawn next recurring copy
    if (order.recurrence !== "none") {
      const nextDate = new Date();
      if (order.recurrence === "daily") {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (order.recurrence === "weekly") {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (order.recurrence === "monthly") {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }

      const nextOrder: ScheduledOrder = {
        id: `sch-rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: order.userId,
        userName: order.userName,
        userAvatar: order.userAvatar,
        entryFee: order.entryFee,
        dateTime: nextDate.toISOString(),
        recurrence: order.recurrence,
        projectId: order.projectId,
        projectName: order.projectName,
        status: "pending"
      };
      orders.push(nextOrder);
    }

    saveOrders(orders);
    res.json({ success: true, order });
  });

  // Mark an order as applied by client (meaning user processed funds successfully)
  app.post("/api/scheduled-orders/:id/apply", (req, res) => {
    const { id } = req.params;
    const orders = loadOrders();
    const order = orders.find(o => o.id === id);

    if (!order) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    if (order.status !== "executed") {
      res.status(400).json({ error: "Only executed orders can transition to applied." });
      return;
    }

    order.status = "applied";
    order.appliedAt = new Date().toISOString();
    saveOrders(orders);
    res.json({ success: true, order });
  });

  // Check hero video availability
  app.get("/api/hero-video-status", (req, res) => {
    const publicVideo = path.join(process.cwd(), "public", "hero_video.mp4");
    const exists = fs.existsSync(publicVideo);
    res.json({ exists, url: exists ? "/hero_video.mp4" : null });
  });

  // Upload or update hero video
  app.post("/api/upload-hero-video", (req, res) => {
    try {
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const targetFile = path.join(publicDir, "hero_video.mp4");

      if (Buffer.isBuffer(req.body)) {
        fs.writeFileSync(targetFile, req.body);
      } else if (req.body && req.body.videoBase64) {
        const base64Data = req.body.videoBase64.replace(/^data:video\/\w+;base64,/, "");
        fs.writeFileSync(targetFile, Buffer.from(base64Data, "base64"));
      } else {
        res.status(400).json({ error: "No video payload received" });
        return;
      }

      // Also sync with dist if it exists
      const distDir = path.join(process.cwd(), "dist");
      if (fs.existsSync(distDir)) {
        fs.copyFileSync(targetFile, path.join(distDir, "hero_video.mp4"));
      }

      console.log(`[Hero Video] Video uploaded successfully to ${targetFile}`);
      res.json({ success: true, url: "/hero_video.mp4" });
    } catch (err) {
      console.error("Error saving hero video:", err);
      res.status(500).json({ error: "Failed to save video" });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully running on http://localhost:${PORT}`);
  });
}

startServer();
