import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Item from "@/models/itemModel";

connect()
export async function POST(request) {
    const cookieStore = await cookies()
    const items = await request.json()
    const cookie = cookieStore.get("token")?.value
    const decoded = jwt.verify(cookie, process.env.TOKEN_SECRET)
    const userId = decoded.userId
    const updatedItems = items.map(item => ({
        ...item,
        userId: userId
    }))
    try {
        await Promise.all(
            updatedItems.map(item =>
                Item.updateOne({ _id: item._id }, { $set: item })
            )
        )
        return NextResponse.json({ message: "Items updated successfully" }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}