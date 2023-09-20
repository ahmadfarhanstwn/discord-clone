import { NextResponse } from "next/server"
import { CurrentProfile } from "../../../../../lib/current-profile"
import { db } from "../../../../../lib/db"
import {v4 as uuid} from 'uuid'

export async function PATCH(
    req: Request,
    {params} : {params: {serverId : string}}
) {
    try {
        const profile = await CurrentProfile()
        
        if (!profile) return new NextResponse("Unauthorized", {status: 401})

        if (!params.serverId) return new NextResponse("Bad request", {status: 400})

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuid()
            }
        })
        
        return NextResponse.json(server)

    } catch(error) {
        console.log(error)
        return new NextResponse("Internal server error", {status: 500})
    }
}