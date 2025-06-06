import { NextResponse } from "next/server";
import {connect} from '@/dbConfig/dbConfig'
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request) {
    try{
        const {username,password}= await request.json()
        const user= await User.findOne({username})
        if(user){
            const isValid= await bcryptjs.compare(password,user.password)
            if(!isValid) return NextResponse.json({success:false, error:"invalid password"},{status:200})
            const tokenData = {
                id: user._id,
                username: user.username,
            }
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1s"})
            const response = NextResponse.json({
                message: "Login successful",
                success: true,
            })
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600*24
            })
            return response;
        }
        else return NextResponse.json({success:false, error:"invalid username"},{status:200})
    }catch(error){
        return NextResponse.json({error: error.message}, {status:500})
    }
}