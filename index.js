const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("https://emailsendingapplication.onrender.com/fillForm", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

app.post("https://emailsendingapplication.onrender.com/send-email", (req, res) => {
  const { email, subject, message } = req.body;
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com", // Replace with your provider's SMTP server
    port: 587, // Port may vary depending on your provider
    secure: false, // Use true for TLS, false for non-TLS (consult your provider)
    auth: {
      user: process.env.USER, // Replace with your email address
      pass: process.env.PASS, // Replace with your email password
    },
  });

  const mailOptions = {
    from: "mohitchoudharu2@gmail.com",
    to: email,
    subject: subject,
    text: message,
  };

  // Send email
  transporter.sendMail(mailOptions, async (error, info) => {
    const uploadResult = await cloudinary.uploader
      .upload(
        "https://media.istockphoto.com/id/1451590744/vector/congratulations-beautiful-greeting-card-poster-banner.jpg?s=612x612&w=0&k=20&c=CD60HIUbZNFGDcVWOfBB90Zjp0weQaFBi5CjetIgRSw=",
        {
          public_id: "congratulations",
        }
      )
      .catch((error) => {
        console.log(error, "error coming from cloudinary");
      });

    console.log(uploadResult);
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.send(`
 <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Congratulations</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
              }

              .container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 10px;
                width: 100%;
                max-width: 600px;
                height: 100%;
                max-height: 800px;
                text-align: center;
              }
              .container h1 {
                font-size: 2.5em;
                margin-bottom: 20px;
              }
              .container img {
                object-fit: contain;
                width: 500px;
                height: 500px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email send Successfully</h1>
              <img src="${uploadResult.secure_url}" alt="Celebrating">
            </div>
            <script src="script.js"></script>
          </body>
          </html>
`);
    }
  });
});

app.listen(port, () => {
  console.log("server is running on port 5000");
});
