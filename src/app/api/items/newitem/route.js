import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Item from "@/models/itemModel";

connect()
export async function POST(request) {
    try {
        const cookiestore = await cookies()
        const item = await request.json()
        const cookie = cookiestore.get("token")?.value
        const decoded = jwt.verify(cookie, process.env.TOKEN_SECRET)
        const userId = decoded.userId
        item.userId = userId
        const newDbEntry = Item.create(item)
        return NextResponse.json({ message: "item created successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}