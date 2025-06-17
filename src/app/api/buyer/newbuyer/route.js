import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Item from "@/models/itemModel";
import Buyer from "@/models/buyerModel";

connect()
export async function POST(request) {
    const cookieStore = await cookies()
    const buyer = await request.json()
    const cookie = cookieStore.get("token")?.value
    const decoded = jwt.verify(cookie, process.env.TOKEN_SECRET)
    const userId = decoded.userId
    buyer.userId = userId
    try {
        if (buyer._id) {
            const res=await Buyer.updateOne({ _id: buyer._id }, { $set: buyer })
            return NextResponse.json({ message: "Buyer updated successfully" }, { status: 200 })
        }
        else {
            const existing= await Buyer.findOne({
                name: buyer.name,
                userId: buyer.userId,
            })
            if(existing) return NextResponse.json({message:"Buyer already exists"}, {status:200})
            const res= await Buyer.create(buyer)
            return NextResponse.json({ message: "Buyer created successfully" }, {response:res},{ status: 200 })
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}