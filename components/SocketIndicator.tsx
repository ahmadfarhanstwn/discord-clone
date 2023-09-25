"use client"

import { useSocket } from "./providers/SocketProvider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
    const { isConnected} = useSocket()

    if (!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                Fallback: Polling every 1seconds
            </Badge>
        )
    }
    
    return ( 
        <Badge variant="outline" className="bg-emerald-600 text-white border-none">
            Live: Realtime update
        </Badge>
     );
}
 
export default SocketIndicator;