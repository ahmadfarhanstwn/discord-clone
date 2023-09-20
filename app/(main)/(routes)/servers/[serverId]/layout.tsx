import React from "react";
import { CurrentProfile } from "../../../../../lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "../../../../../lib/db";
import { redirect } from "next/navigation";
import ServerSidebar from "../../../../../components/servers/ServerSidebar";

const ServerIdLayout = async ({children, params} : 
    {children: React.ReactNode, params : {serverId: string}
}) => {
    const profile = await CurrentProfile()
    
    if (!profile) {
        redirectToSignIn()
    }

    const server = await db.server.findFirst({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile?.id
                }
            }
        }
    })

    if (!server) redirect("/")

    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={server.id} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
     );
}
 
export default ServerIdLayout;