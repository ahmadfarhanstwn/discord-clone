import { Member, Profile, Server } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIoServer} from 'socket.io'

export type ServerWithMembersWithProfile = Server & {
    members: (Member & {profile: Profile})[];
}

export type NextApiResponseServerIo = NextApiResponse & { 
    socket: Socket & {
        server: NetServer & {
            io: SocketIoServer
        }
    }
}