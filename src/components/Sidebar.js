import React from 'react'
import { Link } from 'react-router-dom'
import { MdMapsHomeWork } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg'
import { BsChatSquareText,BsFillBookmarkFill,BsThreeDots } from 'react-icons/bs'
import { GoDiffAdded } from 'react-icons/go'
import {IoLogOutOutline} from 'react-icons/io5'
import './styles/Sidebar.css'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

function Sidebar() {
    const { logout, isPending } = useLogout()
    const { user } = useAuthContext()
    return (
        <div className="sidebar">
            <ul className="side_logo">
                <li className="logo-name">
                    <Link to="/">
                        <span className="logo"><MdMapsHomeWork/></span>
                        <span className="l-name">Home Hunt</span>
                    </Link>
                </li>
            </ul>
            <nav>
            <ul className="nav_list">
                <li>    
                    <Link to={`/profile/${user.uid}`}>
                        <span className="icon"><CgProfile/></span>
                        <span className="links_name">Profile</span>
                    </Link>
                </li>
                <li>
                    <Link to={`/addpost`}>
                        <span className="icon"><GoDiffAdded/></span>
                        <span className="links_name">Add Post</span>
                    </Link>
                </li>
                <li>
                    <Link to={`/chats`}>
                        <span className="icon"><BsChatSquareText /></span>
                        <span className="links_name">Chats</span>
                    </Link>
                </li>
            
                <li>
                    <Link to={`/saved/${user.uid}`}>
                        <span className="icon"><BsFillBookmarkFill /></span>
                        <span className="links_name">Saved</span>
                        </Link>
                </li>
                {/* <li>
                        <span className="links_name"></span>
                </li> */}
            </ul>
            </nav>
            <div className="profile_content">
                <div className="profile">
                    <div className="profile_details">
                        <img src={user.photoURL ? user.photoURL : "/default_user.jpg"} alt="profile" />
                        <div className="name_job">
                            <div className="name">{user.displayName}</div>
                        </div>
                    </div>
                    <div>
                        {!isPending && <button id="logout" onClick={logout}><IoLogOutOutline/></button>}
                        {isPending && <button id="logout" disabled><IoLogOutOutline/></button>}
                    </div>                    
                </div>
            </div>
        </div>
    )
}

export default Sidebar
