import { NextResponse } from "next/server"
import prisma from "../../../../prisma/prismadb"

export default POST = async (request) => {
    try {
        const body = await request.json()
        const { email, password, name, invitationCode } = body

        prisma.user.create({
            data: { email, name, password }
        })

        NextResponse.json({})
    } catch (error) {
        console.log(error)
    }
}