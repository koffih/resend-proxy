import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Charge les variables d'environnement
dotenv.config();

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const expectedToken = "Bearer eracoachTokenUltraSecret987";
  
    if (authHeader !== expectedToken) {
      return res.status(401).json({ message: "Unauthorized: invalid or missing token" });
    }
  
    const { to, subject, html } = req.body;
  
    if (!to || !subject || !html) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to,
          subject,
          html,
        }),
      });
  
      const data = await resendRes.json();
      res.status(200).json({ message: "Email sent!", resend: data });
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ready on port ${PORT}`));


