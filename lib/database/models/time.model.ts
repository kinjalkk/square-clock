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
    checkinTime:{
        type:Date
    },
    checkOutTime:{
        type:Date
    },
    hours:{
        type:Number,

    }

    
})
// timeSchema.pre("save",function(next){
//     if(this.checkOutTime && this.checkinTime){
//         const diff= new Date(this.checkOutTime!)-new Date(this.checkinTime);
//         const hours=diff/(1000*60*60);
//         this.hours=hours;       
//     }
//     next()
// } )

const Time = mongoose.models.Time || mongoose.model("Time", timeSchema);

export default Time