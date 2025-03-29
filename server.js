import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Charge les variables d'environnement
dotenv.config();

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "EraCoach Team <team@eracoach.com>",
        to,
        subject,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    res.json({ message: "Email sent!", resend: data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ready on port ${PORT}`));
