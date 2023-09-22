'use client'

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/CreateServerModal";
import InviteModal from "../modals/InviteModal";
import ServerSettingsModal from "../modals/ServerSettingsModal";
import MembersModal from "../modals/MembersModal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null
    
    return ( 
        <>
            <CreateServerModal />
            <InviteModal />
            <ServerSettingsModal />
            <MembersModal />
        </>
     );
}
 
export default ModalProvider;