import React from "react";
import { CurrentProfile } from "../../../../../../../lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "../../../../../../../lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "../../../../../../../components/chats/ChatHeader";
import ChatInput from "../../../../../../../components/chats/ChatInput";
import ChatMessages from "../../../../../../../components/chats/ChatMessages";
import { ChannelType } from "@prisma/client";
import MediaRoom from "../../../../../../../components/MediaRoom";

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
            {channel.type === ChannelType.TEXT && (
                <>
                    <div className="flex-1">
                        <ChatMessages 
                            apiUrl="/api/messages"
                            chatId={channel.id}
                            member={member}
                            name={channel.name}
                            paramKey="channelId"
                            paramValue={channel.id}
                            socketQuery={{
                                channelId: channel.id,
                                serverId: channel.serverId
                            }}
                            socketUrl="/api/socket/messages"
                            type="channel"
                        />
                    </div>
                    <ChatInput 
                        name={channel.name}
                        apiUrl="/api/socket/messages"
                        type="channel"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId
                        }}
                    />
                </>
            )}
           {channel.type === ChannelType.AUDIO && (
                <MediaRoom chatId={channel.id} audio={true} video={false} />
           )}
           {channel.type === ChannelType.VIDEO && (
                <MediaRoom chatId={channel.id} audio={false} video={true} />
           )}
        </div>
     );
}
 
export default ChannelIdPage;