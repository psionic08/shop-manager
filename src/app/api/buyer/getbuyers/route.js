import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Buyer from "@/models/buyerModel"; // corrected model import
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connect();

export async function GET(request) {
  try {
    // Extract token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded.userId;

    // Fetch all buyers for this user
    const buyers = await Buyer.find({ userId: userId });

    return NextResponse.json({ buyers }, {status: 200});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
