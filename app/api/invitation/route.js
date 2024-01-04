import { NextResponse } from "next/server";

import prisma from "../../../prisma/prismadb";

export const POST = async (request) => {
  try {
    const body = await request.json();
    const { code } = body;

    // TODO ONLY ADMIN CAN CREATE INVITATION CODES

    if (!code)
      return NextResponse.json(
        { error: "code is missing" },
        { status: 404 }
      );

    if (code.length !== 6)
      return NextResponse.json(
        { error: "Invitation code must be 6 characters long" },
        { status: 400 }
      );

    const InvitationCode = await prisma.invitation.create({
      data: { code: code },
    });

    return NextResponse.json({ code: InvitationCode });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
