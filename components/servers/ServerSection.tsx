"use client"

import { ChannelType, MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfile } from "../../types";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { useModal } from "../../hooks/useModal";
import { Plus, Settings } from "lucide-react";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    channelType?: ChannelType;
    sectionType: "channel" | "member";
    server?: ServerWithMembersWithProfile
}

const ServerSection : React.FC<ServerSectionProps> = (
    {
        label, role, channelType, sectionType, server
    }
) => {
    const { onOpen } =  useModal()

    return ( 
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channel" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button 
                        onClick={() => onOpen("createChannel", {channelType})}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "member" && (
                <ActionTooltip label="Manage Members" side="top">
                    <button 
                        onClick={() => onOpen("members")}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
     );
}
 
export default ServerSection;