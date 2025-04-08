const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ CORS setup
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

// ✅ Middleware
app.use(express.json());

// ✅ POST endpoint
app.post("/send-reminder", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Dog360 Reminders <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="background-color: #ffe6f0; padding: 20px; font-family: Arial, sans-serif; border-radius: 10px; color: #333;">
          <h2 style="color: #cc3366;">🐶 Dog360 Reminder Alert!</h2>
          <p>Hi there! 👋</p>
          <p>This is a gentle reminder for your beloved pet <strong style="color: #333;">${to}</strong>.</p>
          <p style="background: white; padding: 15px; border-left: 5px solid #cc3366; margin: 20px 0; border-radius: 5px;">
            <strong>Reminder:</strong><br/>
            ${text.replace(/\n/g, "<br/>")}
          </p>
          <p>Don’t forget to check your Dog360 calendar for upcoming events and health records!</p>
          <br/>
          <a href="https://dog360.vercel.app" style="text-decoration: none; background: #cc3366; color: white; padding: 10px 20px; border-radius: 5px;">Visit Dog360</a>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">This is an automated email from Dog360 Reminder System.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
});

// ✅ Root check
app.get("/", (req, res) => {
  res.send("Gmail Reminder API is running!");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
