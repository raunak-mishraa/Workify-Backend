import mongoose,{Schema} from "mongoose";

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        projectUrl : {
            type: String,
            required: true
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    }
    ,{timestamps: true})

export const Project = mongoose.model('Project', projectSchema)