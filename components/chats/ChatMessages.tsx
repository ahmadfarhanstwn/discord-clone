"use client"

import { Member, Message, Profile } from "@prisma/client";
import React, { ElementRef, Fragment, useRef } from "react";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "../../hooks/useChatQuery";
import { Loader, Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import {format} from 'date-fns'
import { useChatSocket } from "../../hooks/useChatSocket";
import { useChatScroll } from "../../hooks/useChatScroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm"

type MessageWithMemberProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

const ChatMessages: React.FC<ChatMessagesProps> = (
    {name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type}
) => { 
    //socket real time
    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQuery({queryKey, apiUrl, paramKey, paramValue})
  
    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)

    useChatSocket({addKey, queryKey, updateKey})
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
    })

    if (status === "loading") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
            </div>
        )
    } 
    
    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong!</p>
            </div>
        )
    }

    return ( 
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && (
                <div className="flex-1" />
            )}
            {!hasNextPage && (
                <ChatWelcome name={name} type={type} />
            )}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                    ) : (
                        <button onClick={() => fetchNextPage()} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">
                            Load previous messages
                        </button>
                    )}
                </div>
            )}
            <div className="flex-1">
                <div className="flex flex-col-reverse mt-auto">
                    {data?.pages.map((group, i) => (
                        <Fragment key={i}>
                            {group.items.map((message : MessageWithMemberProfile) => (
                                <ChatItem
                                    key={message.id}
                                    content={message.content} 
                                    currentMember={member}
                                    deleted={message.deleted}
                                    fileUrl={message.fileUrl}
                                    id={message.id}
                                    isUpdated={message.updatedAt !== message.createdAt}
                                    member={message.member}
                                    socketQuery={socketQuery}
                                    socketUrl={socketUrl}
                                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                />
                            ))}
                        </Fragment>
                    ))}
                </div>
            </div>
            <div ref={bottomRef} />
        </div>
     );
}
 
export default ChatMessages;