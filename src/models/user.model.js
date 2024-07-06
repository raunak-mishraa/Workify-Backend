import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        fullName:{
            type: String,
            required: true
        },
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        avatar:{
            type: String,
            required: true
        },
        isVerified:{
            type: Boolean,
            required: true,
            default: false
        },
        isClient:{
            type: Boolean,
            required: true,
            default: false
        },
        country: {
            type: String,
            required: false,
            default: "India"
        },
        skills:{
            type: [String],
            required: true,
        },
        projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
        profession:{
            type: String
        },
        bookmarkedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
    }
    ,{timestamps:true})

    
    userSchema.pre('save', async function(next){
        if(!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(this)
        next()
    })
    
    userSchema.methods.isCorrectPassword = async function(password){
        // console.log(this.password,password)
        return await bcrypt.compare(password, this.password)
    }

    userSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
                _id: this._id,
                username: this.username,
                isClient: this.isClient,
                email: this.email,
                fullName: this.fullName,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
                // expiresIn:"1m"
            }
        )
    }
    userSchema.methods.generateRefreshToken = function(){
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }
    export const User = mongoose.model('User', userSchema)