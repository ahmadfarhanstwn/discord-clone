import { NextResponse } from "next/server"
import { CurrentProfile } from "../../../lib/current-profile"
import { db } from "../../../lib/db"
import { v4 as uuid } from 'uuid'
import { MemberRole } from "@prisma/client"

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json()
        
        const profile = await CurrentProfile()

        if (!profile) return new NextResponse("Unauthorized",{status: 401})

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                inviteCode: uuid(),
                channels: {
                    create: [
                        {name: "general", profileId: profile.id}
                    ]
                },
                members: {
                    create: [
                        {profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        })

        return NextResponse.json(server)

    } catch(error) {
        console.log("[SERVER POST]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}