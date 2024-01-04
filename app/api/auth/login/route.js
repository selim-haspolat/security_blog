import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prismadb";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );

    return NextResponse.json({ user: user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
