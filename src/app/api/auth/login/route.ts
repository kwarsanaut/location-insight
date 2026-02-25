import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createToken, COOKIE_NAME } from "@/lib/auth";
import users from "@/data/users.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const hashed = await hashPassword(password);
  const user = users.find(
    (u) => u.username === username && u.passwordHash === hashed
  );

  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = await createToken({
    username: user.username,
    role: user.role,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return res;
}
