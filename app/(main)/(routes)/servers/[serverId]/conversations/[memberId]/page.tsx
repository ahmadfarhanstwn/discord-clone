import { redirectToSignIn } from "@clerk/nextjs";
import { CurrentProfile } from "../../../../../../../lib/current-profile";
import { db } from "../../../../../../../lib/db";
import React from "react";
import { redirect } from "next/navigation";
import { findOrCreateConversation } from "../../../../../../../lib/conversations";
import ChatHeader from "../../../../../../../components/chats/ChatHeader";

interface MemberIdPageProps {
    params : {
        serverId: string;
        memberId: string;
    }
}

const MemberIdPage: React.FC<MemberIdPageProps> = async ({params}) => {
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
        </div>
     );
}
 
export default MemberIdPage;