require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");
const axios = require("axios");
const twilio = require("twilio");
const app = express();
const PORT = process.env.PORT || 5007;


app.use(express.json());
app.use(cors());

const otpStore = new Map();
const otpStoreReg = new Map();
// const pendingRegistrations = new Map();

// Twilio Configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Generate OTP via SMS
app.post("/generate-otp-phone", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const verification = await twilioClient.verify.v2
      .services(twilioServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms", // Options: 'sms', 'call', 'email'
      });

    res.status(200).json({
      message: "OTP sent successfully",
      status: verification.status,
    });
  } catch (error) {
    console.log("Failed to generate OTP:", error);
    res.status(500).json({ error: "Failed to generate OTP" });
  }
});

// Verify OTP
app.post("/verify-otp-phone", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const verificationCheck = await twilioClient.verify.v2
      .services(twilioServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      return res.status(200).json({
        message: "OTP verified successfully",
      });
    }

    res.status(400).json({ error: "Invalid OTP" });
  } catch (error) {
    console.log("Failed to verify OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const upload = multer();

async function sendTelegramNotification(message) {
  try {
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(telegramApiUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    return true;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
}

app.post("/send-application-update-email", async (req, res) => {
  try {
    const { email, subject, body } = req.body;
    console.log(email, subject, body);

    if (!email || !subject || !body) {
      return res.status(400).json({ error: "Missing required email parameters" });
    }

    // Prepare email
    const mailOptions = {
      from: "pmsssscholarship.team@gmail.com",
      to: email,
      subject: subject,
      text: body
    };

    const telegramMessage = `
<b>New Application Update</b>
<b>To:</b> ${email}
<b>Subject:</b> ${subject}
<b>Message:</b>
${body}`;

    // Send both notifications
    const [emailResult, telegramResult] = await Promise.allSettled([
      new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) reject(error);
          else resolve(info);
        });
      }),
      sendTelegramNotification(telegramMessage)
    ]);

    // Prepare response
    const response = {
      email: {
        success: emailResult.status === 'fulfilled',
        message: emailResult.status === 'fulfilled' ? 'Email sent successfully' : 'Email failed'
      },
      telegram: {
        success: telegramResult.status === 'fulfilled' && telegramResult.value,
        message: telegramResult.status === 'fulfilled' && telegramResult.value ? 
          'Telegram notification sent successfully' : 'Telegram notification failed'
      }
    };

    // If at least one notification was sent successfully
    if (response.email.success || response.telegram.success) {
      res.status(200).json({
        message: "Notifications sent",
        details: response

        
      });
    } else {
      // Both notifications failed
      res.status(500).json({
        error: "All notifications failed",
        details: response
      });
    }

  } catch (error) {
    console.error("Notification sending failed:", error);
    res.status(500).json({ error: "Failed to process notification request" });
  }
});



app.post("/generate-otp-reg", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with timestamp and email
    otpStoreReg.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Email template
    const mailOptions = {
      from: "pmsssscholarship.team@gmail.com",
      to: email,
      subject: "Your Scholarship Disbursement System Verification OTP",
      html: `
        <h2>Scholarship Disbursement System Verification OTP</h2>
        <p>Your OTP for Scholarship Disbursement System verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      `
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({
      message: "OTP sent successfully",
      email: email
    });

  } catch (error) {
    console.error("OTP generation failed:", error);
    res.status(500).json({ error: "Failed to generate and send OTP" });
  }
});

app.post("/verify-otp-reg", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const otpData = otpStoreReg.get(email);

  if (!otpData) {
    return res.status(400).json({ error: "No OTP found for this email" });
  }

  // Check if OTP is expired (10 minutes)
  if (Date.now() - otpData.timestamp > 10 * 60 * 1000) {
    otpStoreReg.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  // Check if too many attempts
  if (otpData.attempts >= 3) {
    otpStoreReg.delete(email);
    return res.status(400).json({ error: "Too many attempts. Please request a new OTP" });
  }

  // Verify OTP
  if (otpData.otp === otp) {
    otpStoreReg.delete(email);
    res.status(200).json({
      message: "OTP verified successfully",
      kycKey: `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  } else {
    otpData.attempts += 1;
    otpStoreReg.set(email, otpData);
    res.status(400).json({ error: "Invalid OTP" });
  }
});



// Generate OTP endpoint
app.post("/generate-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with timestamp and email
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Email template
    const mailOptions = {
      from: "pmsssscholarship.team@gmail.com",
      to: email,
      subject: "Your KYC Verification OTP",
      html: `
        <h2>KYC Verification OTP</h2>
        <p>Your OTP for KYC verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      `
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({
      message: "OTP sent successfully",
      email: email
    });

  } catch (error) {
    console.error("OTP generation failed:", error);
    res.status(500).json({ error: "Failed to generate and send OTP" });
  }
});

// Verify OTP endpoint
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const otpData = otpStore.get(email);

  if (!otpData) {
    return res.status(400).json({ error: "No OTP found for this email" });
  }

  // Check if OTP is expired (10 minutes)
  if (Date.now() - otpData.timestamp > 10 * 60 * 1000) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  // Check if too many attempts
  if (otpData.attempts >= 3) {
    otpStore.delete(email);
    return res.status(400).json({ error: "Too many attempts. Please request a new OTP" });
  }

  // Verify OTP
  if (otpData.otp === otp) {
    otpStore.delete(email);
    res.status(200).json({
      message: "OTP verified successfully",
      kycKey: `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  } else {
    otpData.attempts += 1;
    otpStore.set(email, otpData);
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// Existing upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    res.status(200).json({
      message: "File uploaded successfully",
      file: result,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).send("Failed to upload file.");
  }
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${PORT}`);

});
