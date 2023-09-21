import React from "react";
import { CurrentProfile } from "../../../../../lib/current-profile";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "../../../../../lib/db";
import { Dna } from "lucide-react";

interface InviteCodePageProps {
    params : {
        inviteCode: string
    }
}

const InviteCodePage:React.FC<InviteCodePageProps> = async ({params}) => {
    const profile = await CurrentProfile()

    if (!profile) return redirectToSignIn()

    if (!params.inviteCode) return redirect("/")

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) return redirect(`/servers/${existingServer.id}`)

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }        
    })

    if (server) return redirect(`/servers/${server.id}`)
    
    return null;
}
 
export default InviteCodePage;