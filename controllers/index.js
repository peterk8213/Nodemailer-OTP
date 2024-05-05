const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const nodemailer = require('nodemailer');
require('dotenv').config()
// import the email schema

const Email = require('../models/emails');

function generateFiveDigitNumber() {
    // Generate a cryptographically secure random 32-bit integer
    const randomBytes = crypto.randomBytes(4);

    // Convert the random bytes to a number (may be negative)
    const randomNumber = randomBytes.readUInt32BE();

    // Ensure the number is positive (optional)
    const positiveNumber = Math.abs(randomNumber);

    // Extract the last 5 digits (may start with 0)
    const fiveDigitNumber = positiveNumber.toString(10).substring(0, 5);

    return fiveDigitNumber;
}



const emailVerification = async(req,res)=>{

    try {
        
        const myNumber = generateFiveDigitNumber();
        const{userName,email} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if(!userName||!email){
            return res.status(StatusCodes.OK).json("Please provide username and email")
        }
        if (!emailRegex.test(email)) {
          return res.status(StatusCodes.OK).json("invalid email");
        }
      
        console.log(userName,email,myNumber);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            }
        });
        const newEmail = new Email({
            username:userName,
            email:email,
        })

        // send email

        let info = await transporter.sendMail({
            from:process.env.USER,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is ${myNumber}`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5; /* Light gray background */
                }
            
                .container {
                  padding: 20px;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff; /* White container */
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
            
                .logo img {
                  text-align: center;
                  margin-bottom: 20px;
                  width: 100%;
                }
            
                img {
                  width: 150px; /* Adjust width as needed */
                  height: auto;
                }
            
                .content {
                  line-height: 1.5;
                }
            
                .otp {
                  font-size: 24px;
                  font-weight: bold;
                  text-align: center;
                  margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">
                  <img src="https://cc-prod.scene7.com/is/image/CCProdAuthor/mascot-logo-design_P1_900x420?$pjpeg$&jpegSize=200&wid=900" alt="Company Logo">
                </div>
                <div class="content">
                  <p>Thank you${userName} for signing up on our platform!</p>
                  <p>To verify your email address and complete your registration, please enter the following One-Time Password (OTP):</p>
                  <h2 class="otp">${myNumber}</h2>
                  <p>If you did not request this verification code, please ignore this email.</p>
                </div>
              </div>
            </body>
            </html>
            `
        })

        console.log('mail sent successfully')
        res.json("mail delivered successfully")


    }catch(error) {
        console.log(error)
    }
}

module.exports = {
    emailVerification
}