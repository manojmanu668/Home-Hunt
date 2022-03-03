import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import { Outlet, useMatch } from "react-router-dom";
import './Chats.css'

function Chats() {
    const match = useMatch('/chats');

    return (
        <>
                {match ? 
                    <div className="msg-header">
                        <div className="msg-intro">Select a user</div> 
                    </div> :
                    <Outlet/>
                }
        </>
    )
}

export default Chats
