var express = require('express');

var studentController = require('../src/student/studentController.js');
const router = express.Router();

router.route('/student/login').post(studentController.loginUserControllerFn);
router.route('/student/create').post(studentController.createStudentControllerFn);
router.route('/getUserDetails').get(studentController.getUserDetails);
router.route('/sendotp').post(studentController.sendotp);
router.route('/changepassword').post(studentController.changepassword);

// router.p('/verify-otp',verifyOTP);
module.exports = router;

