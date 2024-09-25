import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    
    client: {
        type: String,
        required: true,
    },
    project:{
        type:String,
        required:true,
    },
    maxTime:{
        type:Number,
        default:0,
    }
    
})
projectSchema.index({ client: 1, project: 1 }, { unique: true });
const Project =mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project