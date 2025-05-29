import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connect()
// Calls the connect function to establish a connection to the database.


export async function POST(request){
    try {
        const reqBody = await request.json()
        const {username, password} = reqBody
        const user = await User.findOne({username})
        if(user){
            return NextResponse.json({success:false,error: "User already exists"}, {status: 200})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}