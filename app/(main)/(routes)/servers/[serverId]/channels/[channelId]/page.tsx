import React from "react";
import { CurrentProfile } from "../../../../../../../lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "../../../../../../../lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "../../../../../../../components/chats/ChatHeader";

interface ChannelIdPageProps {
    params : {
        serverId: string,
        channelId: string
    }
}

const ChannelIdPage: React.FC<ChannelIdPageProps> = async ({params}) => {
    const profile = await CurrentProfile()

    if(!profile) return redirectToSignIn()

    const channel = await db.channel.findFirst({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    })

    if (!channel || !member) return redirect("/")
    
    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
        </div>
     );
}
 
export default ChannelIdPage;