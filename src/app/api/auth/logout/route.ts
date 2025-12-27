import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Clear access_token
    response.cookies.set("access_token", "", {
        path: "/",
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
    });

    // Clear auth_token (legacy support)
    response.cookies.set("auth_token", "", {
        path: "/",
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
    });

    return response;
}
