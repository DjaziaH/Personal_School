const mongoose = require('mongoose');
const ContentSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 2
    },
    type:{
        type:String,
        required:true,
    },
    link:{
        type:String,
        required:true,
        minlength:10
    },
    _courseId:{
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Content = mongoose.model('Content',ContentSchema);
module.exports = {Content}