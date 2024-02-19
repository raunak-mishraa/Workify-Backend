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
    }
    ,{timestamps:true})

    
    userSchema.pre('save', async function(next){
        if(!this.isModified('password')) return next();
        this.password = bcrypt.hash(this.password, 10)
        next()
    })
    
    userSchema.methods.isCorrectPassword = async function(password){
        return await bcrypt.compare(password, this.password)
    }

    userSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
                _id: this._id,
                username: this.username,
                email: this.email,
                fullName: this.fullName,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
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
                expiresIn: process.env.REFRESH_TOKEN_SECRET
            }
        )
    }
    export const User = mongoose.model('User', userSchema)