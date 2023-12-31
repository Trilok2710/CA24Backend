var express = require('express');

var studentController = require('../src/student/studentController.js');
const router = express.Router();

router.route("/").get((req, res) => {
    console.log("called");
    console.log(req);
    res.send("Website running").status(200);
})
router.route('/student/login').post(studentController.loginUserControllerFn);
router.route('/student/create').post(studentController.createStudentControllerFn);
router.route('/getUserDetails').get(studentController.getUserDetails);
router.route('/sendotp').post(studentController.sendotp);
router.route('/changepassword').post(studentController.changepassword);

// router.p('/verify-otp',verifyOTP);
module.exports = router;

