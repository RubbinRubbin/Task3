import express from "express";
import cors from "cors";
import { config } from "./lib/config.js";
import analyzeRouter from "./routes/analyze.js";
import generateRouter from "./routes/generate.js";
import healthRouter from "./routes/health.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    endpoints: ["/api/analyze", "/api/generate", "/api/health"],
  });
});
app.use("/api/analyze", analyzeRouter);
app.use("/api/generate", generateRouter);
app.use("/api/health", healthRouter);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});
