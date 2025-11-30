import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Allow your Vite dev server origin
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const ASGARDEO_TENANT_BASE = "https://api.asgardeo.io/t/idcardapp";
const ASGARDEO_SCIM_URL = `${ASGARDEO_TENANT_BASE}/scim2/Users`;

// Use SCIM / API token from env
const tokenFromEnv = process.env.ASGARDEO_SCIM_TOKEN;

if (!tokenFromEnv) {
  console.error(
    "ASGARDEO_SCIM_TOKEN is not set. Please set it before running the server."
  );
  process.exit(1);
}

const ASGARDEO_AUTH_HEADER = `Bearer ${tokenFromEnv}`;

app.post("/api/create-user", async (req, res) => {
  try {
    const scimPayload = req.body;

    const response = await fetch(ASGARDEO_SCIM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ASGARDEO_AUTH_HEADER,
      },
      body: JSON.stringify(scimPayload),
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    res.status(response.status).json(data);
  } catch (err) {
    console.error("Backend /api/create-user error:", err);
    res.status(500).json({ detail: "Server error calling Asgardeo SCIM." });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
