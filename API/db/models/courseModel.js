const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 2
    },
    objectif:{
        type:String,
        required:true,
        minlength:10
    },
    _moduleId:{
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Course = mongoose.model('Course',CourseSchema);
module.exports = {Course}