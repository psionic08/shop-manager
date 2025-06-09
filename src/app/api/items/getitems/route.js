import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Item from "@/models/itemModel";
import jwt from "jsonwebtoken";

connect();

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get("token")?.value;
        const decoded = jwt.verify(cookie, process.env.TOKEN_SECRET)
        const userId = decoded.userId
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No userId in cookies" }, { status: 401 });
        }
        const items = await Item.find({ userId });

        return NextResponse.json({ items }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
