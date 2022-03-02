import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import './Profile.css'
import { MdEmail } from 'react-icons/md';
import { BiPhoneCall } from 'react-icons/bi';
import { GrView } from 'react-icons/gr';
import { FaCity } from 'react-icons/fa';
import { AiFillEdit } from 'react-icons/ai';
import { BsCardImage } from 'react-icons/bs';
import { useParams } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import Posts from '../../components/Posts';
import { useState, useEffect } from 'react';
import UpdateForm from '../../components/UpdateForm';
import { useDocument } from '../../hooks/useDocument'

function Profile() {    
    const { user } = useAuthContext()
    const { id } = useParams()
    const { document } = useDocument('users',id)
    const { documents, error } = useCollection(['posts'],'',['createdAt', 'desc'])
    const [count, setCount] = useState(0)
    const [update, setUpdate] = useState(false)
    
    const updateHandler = () => {
        update ? setUpdate(false) : setUpdate(true)
    }

    useEffect(() => {
        {documents && documents.map( (doc) => (
            user.uid === doc.createdBy.id ? setCount(prevCount => prevCount + 1): ''
            ))}
        return ()=>setCount(0)
    }, [documents])

    // console.log('profile user',user.photoURL)
    // console.log(documents.length)

    return (
        <>{!update ? 
            <div className="edit-butt" onClick={updateHandler}>
                <AiFillEdit/><span>Edit</span>
            </div>
            :
                ''
            }
            
        {!update && document != null ? (<>
        <div className="wrapper">
            <div className="profile-container">
                <div className="profile-img">
                    <img src={!document.photoURL ? "/default_user.jpg" : document.photoURL } alt="profile image" ></img>
                </div>
                <div className="profile-name">
                    <h2>{document.displayName}</h2>
                    <span className="icon"><MdEmail/></span>
                    <span className="name">{document.email && document.email}</span><br />
                    {document && document.phoneNumber ?
                    <div className="phn-tab">
                        <span className="icon" ><BiPhoneCall/></span>
                        <span className="name">{document.phoneNumber}</span> 
                    </div>: ''}
                </div>
            </div>
            <div className="profile-container address-container">
                <div className="add-desk">
                    {document && document.cityName ?
                    <>
                        <div className="city">
                            <span className="icon"><FaCity/></span>
                            <span className="name">{document.cityName}, {document.stateName}</span><br />     
                        </div>
                    </>: ''}
                    <div className="post">
                        <span className="icon"><BsCardImage/></span>
                        <span className="name">Number of posts</span>
                        <span className='value' >{count}</span> <br />    
                    </div>
                    <div className="views">
                        <span className="icon"><GrView/></span>
                        <span className="name">Number of views</span>
                        
                        <br />     
                    </div>
                </div>
            </div>
        </div>

            <div className="post-container">
            {documents && documents.map(doc => (
                id === doc.createdBy.id && doc.isActive ? ( 
                    <div key={doc.id}>
                        <Posts docs={doc}/> 
                    </div>
                 ) : ''
            ))}
            </div>
        </>) : <UpdateForm update={updateHandler} data={document ? document : ''}/>}
        
    </>)
    
}
export default Profile
