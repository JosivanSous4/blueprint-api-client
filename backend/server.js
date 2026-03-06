const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS para produção
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          process.env.FRONTEND_URL || "https://your-domain.vercel.app",
          "https://blueprint-client.vercel.app",
        ]
      : ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const DATA_DIR = path.join(__dirname, "data");
const COLLECTIONS_FILE = path.join(DATA_DIR, "collections.json");
const RESPONSES_FILE = path.join(DATA_DIR, "saved_responses.json");

fs.ensureDirSync(DATA_DIR);
if (!fs.existsSync(COLLECTIONS_FILE)) {
  fs.writeJsonSync(COLLECTIONS_FILE, { collections: [] });
}
if (!fs.existsSync(RESPONSES_FILE)) {
  fs.writeJsonSync(RESPONSES_FILE, { saved_responses: [] });
}

app.use("/api", apiRoutes);

// Health check para monitoramento
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Rate limiting simples
const requestCounts = {};
const RATE_LIMIT = 100; // requests por hora
const WINDOW_MS = 60 * 60 * 1000; // 1 hora

app.use((req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts[clientIp]) {
    requestCounts[clientIp] = { count: 0, resetTime: now + WINDOW_MS };
  }

  if (now > requestCounts[clientIp].resetTime) {
    requestCounts[clientIp] = { count: 0, resetTime: now + WINDOW_MS };
  }

  requestCounts[clientIp].count++;

  if (requestCounts[clientIp].count > RATE_LIMIT) {
    return res.status(429).json({
      error: "Too many requests",
      message: `Rate limit exceeded. Maximum ${RATE_LIMIT} requests per hour.`,
      retryAfter: Math.ceil((requestCounts[clientIp].resetTime - now) / 1000),
    });
  }

  next();
});

app.get("/collections", async (req, res) => {
  try {
    const data = await fs.readJson(COLLECTIONS_FILE);
    res.json(data);
  } catch (error) {
    console.error("Error loading collections:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/collections", async (req, res) => {
  try {
    const { collections } = req.body;
    await fs.writeJson(COLLECTIONS_FILE, { collections });
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving collections:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/saved-responses", async (req, res) => {
  try {
    const data = await fs.readJson(RESPONSES_FILE);
    res.json(data);
  } catch (error) {
    console.error("Error loading saved responses:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/saved-responses", async (req, res) => {
  try {
    const { saved_responses } = req.body;
    await fs.writeJson(RESPONSES_FILE, { saved_responses });
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving saved responses:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/saved-responses/:id", async (req, res) => {
  try {
    const data = await fs.readJson(RESPONSES_FILE);
    const filteredResponses = data.saved_responses.filter(
      (response) => response.id !== parseInt(req.params.id),
    );
    await fs.writeJson(RESPONSES_FILE, { saved_responses: filteredResponses });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting saved response:", error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested resource was not found",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Data directory: ${DATA_DIR}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
