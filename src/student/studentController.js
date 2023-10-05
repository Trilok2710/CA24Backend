const express =require('express');//new
const studentModel=require('./studentModel')
var studentService = require('./studentService');
const jwt = require('jsonwebtoken');//hhh
const secretKey ='nhbgvbhygmjhgfcvghg';//hhh
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config()
// const bcrypt = require('bcrypt');
const key = '123456789trytryrtyr';
const encryptor = require('simple-encryptor')(key);




async function createStudentControllerFn(req, res) {
  try {
     var userEmail = req.body.email;
    console.log(req.body.email);
    let data = req.body;
    data.referralcode = generateReferralCode();
    var status = await studentService.createStudentDBService(data);
    console.log("new user registered");
    console.log(status);
    // const result = await studentModel.findOne({ email: res.body.email });
    // const user = {
    //   id: result._id,
    //   email: req.body.email
    // };
    // const token = jwt.sign(user, secretKey);

    if (status) {
      res.send({ 'status': true, 'message': 'Student created successfully', 'referralCode': data.referralcode});
      sendMail(userEmail);
    } else {
      res.send({ 'status': false, 'message': 'Error creating user' });
      console.log("something wrongoo");
    }
  }
  catch (err) {
    console.log(err);
  }
}








// const createTransporter = async () => {
//   try {
//     const oauth2Client = new OAuth2(
//         '158779573911-m1f8ouv333hjat5mhelj8baquhuid9mb.apps.googleusercontent.com',
//         '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',
//         "https://developers.google.com/oauthplayground"
//       );

//       oauth2Client.setCredentials({
//         refresh_token: '1//04iqlaA3PuJsbCgYIARAAGAQSNwF-L9Ir9QZKpyqsNvkh5sEY7NYmP87ch7rYdjqLGNUYpS_ywu_HjJdeLH8Pko50ayUNaXs9KTk',
//       });

//       const accessToken = await new Promise((resolve, reject) => {
//         oauth2Client.getAccessToken((err, token) => {
//           if (err) {
//             console.log("*ERR: ", err)
//             reject();
//           }
//           resolve(token); 
//         });
//       });

      //const transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //       type: "OAuth2",
        //       user: 'aavhan.24@gmail.com',
        //       accessToken,
        //       clientId: '158779573911-m1f8ouv333hjat5mhelj8baquhuid9mb.apps.googleusercontent.com',
        //       clientSecret:'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',
        //       refreshToken:'1//04iqlaA3PuJsbCgYIARAAGAQSNwF-L9Ir9QZKpyqsNvkh5sEY7NYmP87ch7rYdjqLGNUYpS_ywu_HjJdeLH8Pko50ayUNaXs9KTk'
        //     },
           
        //   });
        //   return transporter;
        // }  catch (err) {
        // return err
        // }};



        // const sendMail = async (userEmail) => {
        //   try {
        //     const mailOptions = {
        //       from: 'aavhan.24@gmail.com',
        //       to:userEmail,
        //       // to: 'trilokchandpanchal@gmail.com',
        //       subject: "Test",
        //       text: "Hi, this is a test email",
        //     }
       
        //     let emailTransporter = await createTransporter();
        //     await emailTransporter.sendMail(mailOptions);
        //   } catch (err) {
        //     console.log("ERROR: ", err)
        //   }
        // };
//createTransporter();
// sendMail();


var loginUserControllerFn = async (req, res) => {
  console.log("heheheheheheh");
  //console.log(req.body);
    var result = null;
    try {
        result = await studentService.loginuserDBService(req.body);
        //console.log(result);
        if (result.status) {
            const user = {
                id: result.userDetails._id,
                email: req.body.email
            };
            //console.log(user);
            const token = jwt.sign(user, secretKey); // Set token expiry time
            console.log(token);
            res.send({ "status": true, "message": result.msg, "token": token });
        } else {
            res.send({ "status": false, "message": result.msg });
        }
      }
         catch (error) {
        console.log(error);
        res.send({ "status": false, "message": error.msg });
    }
}//hhh



// const student = require('./studentModel'); // Adjust the path to your user model

async function getUserDetails(req, res) {
  console.log("working fine")
  //console.log(req.headers);
  const tokenFromRequest = req.headers.authorization.split(' ')[1]; // Get token from request header

  try {
    const decodedToken = jwt.verify(tokenFromRequest, secretKey);
    console.log(decodedToken)
    const userId = decodedToken.id;
    console.log(userId)
    // Fetch user details from the database based on userId
    const student = await studentModel.findById(userId);
    console.log(student);
    if (student) {
      res.json({ userDetails: student });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Unauthorized' });
  }
}


// referralService.js

// Function to generate a random referral code
function generateReferralCode() {
  const codeLength = 14; // You can adjust the length as needed
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}



const transporter = nodemailer.createTransport({

  service:'Gmail',
  auth:{
    user:'aavhan.24@gmail.com',
    pass:'hwcz tmoz jyep tjif'
  }
});
                



// API endpoint to send OTP email
async function sendotp(req, res)  {
  const { email } = req.body;
  console.log(email);
  const otp = generateOTP(); // Implement a function to generate a 6-digit OTP

  const mailOptions = {
    from: 'aavhan.24@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Email could not be sent.' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully.',otp :otp});
    }
  });
};

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Function to generate a random 6-digit OTP
function generateOTP() {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}




// In your OTP verification controller (e.g., otpController.js)
const verifyOTP = (req, res) => {
  const { email, enteredOTP } = req.body; // Assuming the user submits their email and the OTP they entered
  // Perform OTP verification logic here
  if (!otpStorage[email]) {
    return res.status(400).json({ message: 'OTP not found or expired' });
  }

  const { otp, timestamp } = otpStorage[email];
  const currentTime = Date.now();

  // Check if OTP has expired (e.g., after 1 minute)
  if (currentTime - timestamp > 60000) {
    delete otpStorage[email]; // Remove expired OTP
    return res.status(400).json({ message: 'OTP has expired' });
  }

  // Compare entered OTP with stored OTP
  if (enteredOTP === otp) {
    // OTP is correct; you can proceed with further actions
    // For example, mark the user as verified or reset their password
    delete otpStorage[email]; // Remove OTP after successful verification
    return res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};






async function changepassword(req,res){
  const {email,newPassword}=req.body;

  try{

    console.log(email)
    const user = await studentModel.findOne({email});

    if(!user){
      return res.status(500).json({ message:'User not found'});
    }
    const hashedPassword = await encryptor.encrypt(newPassword);

    
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
    
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  






module.exports = { createStudentControllerFn,loginUserControllerFn, getUserDetails ,sendotp,verifyOTP,changepassword};
