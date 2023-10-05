const studentModel = require('./studentModel');
const key = '123456789trytryrtyr';
const encryptor = require('simple-encryptor')(key);

module.exports.createStudentDBService = async (studentDetails) => {
    try {
        const studentModelData = new studentModel();

        const existingStudent = await studentModel.findOne({email:studentDetails.email});
        console.log(existingStudent)
        if(existingStudent){
            return resizeBy.status(400).json({error:"User with email already exists"})
        }

        studentModelData.firstname = studentDetails.firstname;
        studentModelData.phone = studentDetails.phone;
        studentModelData.email = studentDetails.email;
        studentModelData.college= studentDetails.college;
        studentModelData.yos= studentDetails.yos;
        studentModelData.referralcode=studentDetails.referralcode;
        const encrypted = encryptor.encrypt(studentDetails.password);
        console.log(encrypted);
        studentModelData.password = encrypted;

        await studentModelData.save();
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
};

module.exports.loginuserDBService = async (studentDetails) => {
    console.log(studentDetails);
    try {
        console.log('login req sent:',studentDetails);
        const result = await studentModel.findOne({ email: studentDetails.email });
        console.log(studentDetails);
        console.log(result);
        
        if (result != undefined && result != null) {
            const decrypted = encryptor.decrypt(result.password);

            if (decrypted === studentDetails.password) {
                return { status: true, msg: "Student Validated Successfully", userDetails: result };
            } else {
                throw { status: false, msg: "Student Validated failed" };
            }
        } else {
            throw { status: false, msg: "Student Error Details" };
        }
    } catch (error) {
        throw { status: false, msg: "Invalid Data" };
    }
};
module.exports.getUserDetails = async (email) => {
    try {
        console.log("user details req sent")
        console.log(email);
        const userDetails = await studentModel.findOne({ email: email });
        console.log(userDetails)
        return userDetails;
    } catch (error) {
        throw error;
    }
};