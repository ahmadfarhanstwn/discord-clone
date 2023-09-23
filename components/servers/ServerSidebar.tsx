import React from "react";
import { CurrentProfile } from "../../lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface serverSidebarProps {
    serverId : string
}

const channelIconMap = {
    [ChannelType.TEXT] : <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO] : <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO] : <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
    [MemberRole.GUEST] : null,
    [MemberRole.ADMIN] : <ShieldAlert className="mr-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.MODERATOR] : <ShieldCheck className="mr-2 h-4 w-4 text-rose-500" />
}

const ServerSidebar: React.FC<serverSidebarProps> = async ({serverId}) => {
    const profile = await CurrentProfile()

    if (!profile) return redirect("/")

    const server = await db.server.findFirst({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                   role: "asc" 
                }
            }
        }
    })

    if (!server) return redirect("/")

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)

    const role = server.members.find((member) => member.profileId === profile.id)?.role

    return ( 
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="fkex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={[
                        {
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type]
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type]
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIconMap[channel.type]
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        }
                    ]}/>
                </div>
            </ScrollArea>
        </div>
     );
}
 
export default ServerSidebar;