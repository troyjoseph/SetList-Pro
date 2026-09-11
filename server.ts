import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";

const reCAPTCHAThreshold = 0.8; 

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    const correctPassword = process.env.SECRET_PASSWORD;
    
    if (!correctPassword) {
      return res.status(500).json({ error: "SECRET_PASSWORD not configured on server" });
    }

    if (password === correctPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    const { name, email: userEmail, message } = req.body;
    const recipientEmail = process.env.SECRET_EMAIL || "troyjoseph@gmail.com, setlistsharp@gmail.com";
    
    // Email credentials from environment
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    console.log(`--- NEW FEEDBACK RECEIVED ---`);
    console.log(`To: ${recipientEmail}`);
    console.log(`From: ${name} (${userEmail})`);
    console.log(`Message: ${message}`);
    console.log(`-----------------------------`);

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP_USER or SMTP_PASS not configured. Email will not be sent, only logged to console.");
      return res.json({ success: true, note: "Feedback received and logged (SMTP not configured)" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"${name}" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: userEmail,
        subject: `Setlist♯ Feedback from ${name}`,
        text: `Name: ${name}\nEmail: ${userEmail}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
            <h2 style="color: #4f46e5; margin-top: 0;">New Feedback Received</h2>
            <p><strong>From:</strong> ${name} (<a href="mailto:${userEmail}">${userEmail}</a>)</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9; margin-top: 20px;">
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
              Sent from Setlist♯ Feedback System
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      // We still return 200/success to the user so they don't see a scary error 
      // if it's just a mail config issue, but the server logs show the failure.
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  app.post("/api/verify-recaptcha", async (req, res) => {
    const { token, action = 'LOGIN' } = req.body;

    // Skip verification if we are in AI Studio / Development mode
    if (process.env.NODE_ENV !== 'production') {
       return res.json({ success: true, score: 1.0, note: "Bypassed in dev mode" });
    }
    
    // For Enterprise Assessment API, this should be your Google Cloud API Key
    const apiKey = process.env.SECRET_RECAPTCHA_KEY;
    
    // The SITE KEY is public and must be provided in the event object
    const siteKey = process.env.VITE_RECAPTCHA_SITE_KEY || "6Le0s78sAAAAAOtIdD5vSK5XxPBI_c9w1PKZGfO8";
    const projectId = process.env.VITE_RECAPTCHA_PROJECT_ID || "gen-lang-client-0783666869";

    if (!apiKey) {
      console.error("SECRET_RECAPTCHA_KEY (Google Cloud API Key) not configured. Verification required.");
      return res.status(500).json({ error: "reCAPTCHA is not configured on the server." });
    }

    try {
      const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: {
            token: token,
            siteKey: siteKey,
            expectedAction: action,
          },
        }),
      });
      
      const data: any = await response.json();
      
      if (data.error) {
        console.error("reCAPTCHA Enterprise Error:", data.error);
        return res.status(500).json({ error: data.error.message });
      }

      // In Enterprise, we check the score in the riskAnalysis object
      const score = data.riskAnalysis?.score;
      const isHuman = (typeof score === 'number') && score >= reCAPTCHAThreshold;
      
      if (!isHuman) {
        console.warn("reCAPTCHA Verification Failed or Low Score:");
        console.warn("Full Response Data:", JSON.stringify(data, null, 2));
      }
      
      res.json({ 
        success: isHuman, 
        score: score, 
        reason: data.riskAnalysis?.reasons,
        tokenProperties: data.tokenProperties 
      });
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      res.status(500).json({ error: "Failed to verify reCAPTCHA" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
