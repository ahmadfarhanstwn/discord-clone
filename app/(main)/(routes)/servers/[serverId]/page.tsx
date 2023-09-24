import { redirectToSignIn } from "@clerk/nextjs";
import { CurrentProfile } from "../../../../../lib/current-profile";
import { db } from "../../../../../lib/db";
import React from "react";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
   params: {serverId: string}
}

const ServerIdPage:React.FC<ServerIdPageProps> = async ({params}) => {
   const profile = await CurrentProfile()

   if (!profile) return redirectToSignIn()

   const server = await db.server.findFirst({
      where: {
         id: params.serverId,
         members: {
            some: {
               profileId: profile.id
            }
         }
      },
      include: {
         channels: {
            where: {
               name: "general"
            },
            orderBy: {
               createdAt: "asc"
            }
         }
      }
   })

   const initialChannel = server?.channels[0]

   if (initialChannel?.name !== "general") return null

    return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`)
}
 
export default ServerIdPage;