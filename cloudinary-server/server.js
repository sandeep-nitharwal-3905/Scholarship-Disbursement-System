
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

const otpStore = new Map();
const otpStoreReg = new Map();
// const pendingRegistrations = new Map();

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

const upload = multer();

// Add this to your existing server.js file

app.post("/send-application-update-email", async (req, res) => {
  try {
    const { email, subject, body } = req.body;
    console.log(email, subject, body);
    
    if (!email || !subject || !body) {
      return res.status(400).json({ error: "Missing required email parameters" });
    }

    const mailOptions = {
      from: "jerrybhaijaan@gmail.com",
      to: email,
      subject: subject,
      text: body
    };
    console.log(mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending application update email:", error);
        return res.status(500).json({ error: "Failed to send email" });
      }
      
      console.log("Application update email sent:", info.response);
      res.status(200).json({ 
        message: "Application update email sent successfully",
        email: email
      });
    });

  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ error: "Failed to process email request" });
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
      from: "jerrybhaijaan@gmail.com",
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
      from: "jerrybhaijaan@gmail.com",
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


