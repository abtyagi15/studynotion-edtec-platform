const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newSection = await Section.create({
            sectionName: sectionName,
            course: courseId,
        });

        const updatedCourse = await Course.findByIdAndUpdate(courseId,{
            $push:{coursecontent: newSection._id}
        },{new:true})

        return res.status(200).json({
            succcess:true,
            message: "Section created successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in creating section",
        });
    }
}

exports.updateSection = async (req, res) => {
    try{
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId,{
            sectionName: sectionName,
        },{new:true})

        return res.status(200).json({
            succcess:true,
            message: "Section updated successfully",
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in updating section",
        });
    }
}

exports.deleteSection = async (req, res) => {
    try{
        const {sectionId} = req.params;
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in deleting section",
        });
    }
 }