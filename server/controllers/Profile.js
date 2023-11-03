const Profile = require('../models/Profile');   

exports.updateProfile = async (req, res) => {
    try{
        //get data
        const {dateOfBirth="",about="",contactNumber,gender} = req.body;

        //get user id
        const id = req.user.id;

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        //find user
        const userDetails = await User.findById(id);

        //find profile 
        const profileDetails = await Profile.findById(userDetails.additionalDetails);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        //response
        return res.status(200).json({
            success:true,
            message: "Profile updated successfully",
            profileDetails
        })
    }catch(errror){
        return res.status(500).json({
            success: false,
            message: "Error in updating profile"
        })
    }
}

exports.deleteProfile = async (req, res) => {
    try{
        //get the profile id
        const id = req.user.id;

        //validation of id
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        //delete user
        await User.findByIdAndDelete({_id: id});
        //return response
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in deleting profile"
        })
    }
}