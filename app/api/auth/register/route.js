import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prismadb";
import bcrypt from "bcrypt";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { email, password, name, code } = body;
    const hashedPassword = await bcrypt.hash(password, 11);

    if (!email || !password || !name || !code)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const inviteCode = await prisma.invitation.findUnique({
      where: {
        code: code,
        isActive: true,
      },
    });

    if (!inviteCode)
      return NextResponse.json(
        { error: "Invalid invitation code" },
        { status: 400 }
      );

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    await prisma.invitation.update({
      where: {
        id: inviteCode.id,
      },
      data: {
        isActive: false,
        userId: user.id,
      },
    });

    return NextResponse.json({ user: user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
