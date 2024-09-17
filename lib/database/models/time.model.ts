import mongoose from "mongoose";

const timeSchema = new mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
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