const mongoose = require('mongoose');
const ModuleSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 2
    },
    description:{
        type:String,
        required:true,
        minlength:10
    }
})

const Module = mongoose.model('Module',ModuleSchema);
module.exports = {Module}