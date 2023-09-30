import { useQueryClient } from "@tanstack/react-query"
import { SocketProvider, useSocket } from "../components/providers/SocketProvider"
import { useEffect } from "react"
import { Member, Message, Profile } from "@prisma/client"

type useChatSocketProps = {
    addKey : string,
    updateKey: string,
    queryKey: string,
}

type messageWithMemberProfile = Message & {
    member : Member & {
        profile: Profile
    }
}

export const useChatSocket = ({addKey, queryKey, updateKey} : useChatSocketProps) => {
    const { socket } = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket) return

        socket.on(updateKey, (message: messageWithMemberProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData

                const newData = oldData.pages.map((page : any) => {
                    return {
                        ...page,
                        items: page.items.map((item: messageWithMemberProfile) => {
                            if (item.id === message.id) return message
                            return item
                        })
                    }
                })

                return {
                    ...oldData,
                    pages: newData
                }
            })
        })

        socket.on(addKey, (message: messageWithMemberProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) 
                    return {
                        pages: [{
                            items: [message]
                        }]}

                const newData = [...oldData.pages]

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items
                    ]}
                
                return {
                    ...oldData,
                    pages: newData
                }
            })
        })

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [addKey, updateKey, queryKey, socket, queryClient])
}