import React from 'react'
import { Link } from 'react-router-dom'
import './styles/Navbar.css'
import { MdMapsHomeWork } from 'react-icons/md';
import {IoLogOutOutline} from 'react-icons/io5'
import { useAuthContext } from '../hooks/useAuthContext'


function Navbar() {
    const { user } = useAuthContext()

    return (
        <div className="navbar">
            <ul>
                <li className="logo-name">
                    <Link to="/">
                        <span className="logo"><MdMapsHomeWork/></span>
                        <span className="l-name">Home Hunt</span>
                    </Link>
                </li>

                {!user && <>
                    <li className="log-sign">
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </li>
                </>}

            </ul>
        </div>
    )
}

export default Navbar
