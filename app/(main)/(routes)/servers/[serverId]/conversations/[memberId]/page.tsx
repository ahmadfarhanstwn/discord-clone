import { redirectToSignIn } from "@clerk/nextjs";
import { CurrentProfile } from "../../../../../../../lib/current-profile";
import { db } from "../../../../../../../lib/db";
import React from "react";
import { redirect } from "next/navigation";
import { findOrCreateConversation } from "../../../../../../../lib/conversations";
import ChatHeader from "../../../../../../../components/chats/ChatHeader";
import ChatMessages from "../../../../../../../components/chats/ChatMessages";
import ChatInput from "../../../../../../../components/chats/ChatInput";
import MediaRoom from "../../../../../../../components/MediaRoom";

interface MemberIdPageProps {
    params : {
        serverId: string;
        memberId: string;
    },
    searchParams: {
        video?: boolean
    }
}

const MemberIdPage: React.FC<MemberIdPageProps> = async ({params, searchParams}) => {
    const profile = await CurrentProfile()

    if (!profile) return redirectToSignIn()

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if (!currentMember) return redirect('/')

    const conversation = await findOrCreateConversation(currentMember.id, params.memberId)

    if (!conversation) return redirect(`/servers/${params.serverId}`)
    
    const {memberOne, memberTwo} = conversation

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne
    
    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader 
                name={otherMember.profile.name} 
                serverId={params.serverId} 
                type="conversation" 
                imageUrl={otherMember.profile.imageUrl} 
            />
            {searchParams.video && (
                <MediaRoom chatId={conversation.id} video={true} audio={false} />
            )}
            {!searchParams.video && (
                <>
                    <ChatMessages 
                        apiUrl="/api/direct-messages"
                        chatId={conversation.id}
                        member={currentMember}
                        name={otherMember.profile.name}
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                        socketUrl="/api/socket/direct-messages"
                        type="conversation"
                    />
                    <ChatInput 
                        apiUrl="/api/socket/direct-messages"
                        name={otherMember.profile.name}
                        query={{conversationId: conversation.id}}
                        type="conversation"
                    />
                </>
            )}
        </div>
     );
}
 
export default MemberIdPage;