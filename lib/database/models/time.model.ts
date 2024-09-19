import mongoose from "mongoose";

const timeSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    userMail:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    projectName:{
        type:String,
        required:true,
    },
    clientName:{
        type:String,
        required:true,
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    checkInTime:{
        type:Date,
        default:Date.now
    },
    checkOutTime:{
        type:Date
    },
    hours:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:""
    }
})
timeSchema.pre("save",function(next){
    if(this.checkOutTime && this.checkInTime){
        const time:any=this;
        time.hours=(time.checkOutTime-time.checkInTime)/1000/60/60;     
    }
    next()
} )

const Time = mongoose.models.Time || mongoose.model("Time", timeSchema);

export default Time