const {instance} = require("../config/Razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollementEmail");

//caputer the payment and initiate razorpay instance
exports.capturePayment = async (req,res) => {
    try{
        //get course id and user id
        const {courseId} = req.body;
        const userId = req.user.id;
        //validation
        if(!courseId){
            return res.json({
                success: false,
                message: "Invalid course id"
            })
        }

        const courseDetails = await Course.findById(courseId);
        if(!courseDetails){
            return res.json({
                success: false,
                message: "Course not found"
            })
        }

        //user already paid.
        if(Course.studentsEnrolled.includes(userId)){
            return res.json({
                success: false,
                message: "You have already paid for this course"
            })
        }
        //order create 
        const amount = courseDetails.price;
        const currency = "INR";

        const options = {
            amount: amount*100,
            currrenc: currency,
            reciept: Math.randow(Date.now()).toString(),
            notes: {
                courseId: courseId,
                userId: userId
            }
        }

        try{
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);

            return res.status(200).json({
                success: true,
                message: "Payment gateway created successfully",
                courseName: courseDetails.courseName,
                courseDescription: courseDetails.courseDescription,
                thumbnail: courseDetails.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,
            })
        }
        catch(error){
            return res.json({
                success: false,
                message: "Error in creating order"
            })
        }
        //response
    }catch(error){
        return res.status(500).json({
            succes:false,
            message: "Error in creating payment gateway"
        })
    }
}

//verify signature of razorpay
exports.verifySignature = async (req,res) => {
    const webHookSecret = "123456789";
    const signature = req.headers["x-razorpay-signature"];

    const hashedWebHookSecret = crypto.createHmac("sha256",webHookSecret);

    hashedWebHookSecret.update(JSON.stringify(req.body));
    const digest = hashedWebHookSecret.digest("hex");

    if(signature === digest){
        console.log("Payment is authorised");

        const {courseId, UserId} = req.body.payload.payment.entity.notes;

        try{
            //fullfill the action

            //find the course and enroll student in it
            const  enrolledCourse = await Course.findByIdAndUpdate({_id: courseId},{
                $push:{studentsEnrolled: userId}
            }, {new: true});

            if(!enrolledCourse){
                return res.json({
                    success: false,
                    message: "Error in enrolling student in course"
                })
            }   

            //updating the user course list
            const updatedUser = await User.findByIdAndUpdate({_id: userId},{
                $push:{courses: courseId}
            },{new: true});        
            
            //confirmation mail to the student
            const mailResponse = await mailSender({
                email: updatedUser.email,
                title: "Congratulations! You have successfully enrolled in the course",
                body:  courseEnrollmentEmail(updatedUser.name,enrolledCourse.courseName),
            })
            console.log(mailResponse);
            return res.status(200).json({
                success:true,
                message: "Payment successfull and confimation mail sent to the registered email id"
            })
        }catch(error){
            return res.json({
                success: false,
                message: "Error in enrolling student in course",
                error: error.message
            })
        }
    }
}