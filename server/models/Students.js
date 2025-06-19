const mongoose=require('mongoose')
const StudentSchema=new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    cfHandle:String,
    currentRating:Number,
    maxRating:Number,
    lastSyncedAt:Date,
    reminderCount:{type:Number ,default:0},
    reminderEmailEnabled:{type:Boolean,default:true},
    submissionData:[Object],
    contestHistory:[Object],
    submissionHeatmap: { type: Map, of: Number },
    totalProblems: Number,
    todayProblems: Number,
});
module.exports=mongoose.model('Students',StudentSchema);