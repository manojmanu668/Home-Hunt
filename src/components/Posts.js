import React, {useState} from 'react'
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import { useFirestore } from '../hooks/useFirestore'
import { useCollection } from '../hooks/useCollection';
import { useEffect } from 'react';
import { useTag } from '../components/useTag'
import { useDeletePost } from './useDeletePost';


function Posts({docs}) {
    const { user } = useAuthContext()
    // const {  addDocument, response } = useFirestore(['users',`${user.uid}`,'saved'])
    const { updateDocument } = useFirestore(['posts'])
    const { documents, error } = useCollection(['posts',`${docs.id}`,'saved'],'','')
    const { deletePost } = useDeletePost(docs.id)
    const [tag, setTag] = useState(false)
    const { handleSave , handleUnsave, err } = useTag(docs)
    const [imgNum, setImgNum] = useState(0)
    const [imgCount, setImgCount] = useState(1)
    const [viewImg, setViewImg] = useState(null)
    const errr = err

    useEffect(() => {
        {documents && documents.map(post => 
            user.uid === post.userId && setTag(true) 
            )}
         setViewImg(docs.selectedImg[0])
        
        return () => {
            setTag(false)
        }
    }, [documents, docs])

    const prevSlides = () => {
        setImgNum(imgNum-1)
        if(imgNum <= 0) {
            setImgNum(docs.selectedImg.length-1)
        } 
    }

    const nextSlides = () => {
        setImgNum(imgNum+1)
        if(imgNum + 1 >= docs.selectedImg.length) {
            setImgNum(0)
        } 
    }
    
    const handleClick = async (id) => {
        await updateDocument(id, {
            isActive: false
        })    
        deletePost()
    }

    return (
        <div className='post-desk'>
            {errr && <div className="error">{errr}</div> }
            <div className="user-post">
                <Link to={`/profile/${docs.createdBy.id}`}>
                    <div className='user-list-item'>
                    <div className='avatar'>
                        <img src={docs.createdBy.photoURL ? docs.createdBy.photoURL : "/default_user.jpg"} alt="user avatar"/>
                    </div>
                    <span>{docs.createdBy.displayName}</span>
                    </div> 
                </Link>
                {user.uid === docs.createdBy.id &&
                    <div className='trash' onClick={() => handleClick(docs.id)}><MdDelete/></div>
                }
            </div>
            <div className='post-img'>
                {/* {docs.selectedImg.map((img, i) => ( */}
                    <div className="mySlides" >
                        {docs.selectedImg.length > 1 && <div className="numbertext">{imgNum+1}/{docs.selectedImg.length}</div>} 
                            <img src={docs.selectedImg[imgNum]} alt="post-images"/>
                    </div>
                {/* ))} */}
                {docs.selectedImg.length > 1 && 
                <>
                    <a className="prev" onClick={() => prevSlides()}>&#10094;</a>
                    <a className="next" onClick={() => nextSlides()}>&#10095;</a>
                </>}
            </div>
            <div className="post-text">
                <div className="post-details">
                    {docs.details}
                </div>
                {docs.cityName && <span>
                <span className='text-head'>Locatin:</span> {docs.cityName}, {docs.sName}
                </span>}
                <span >
                    <span className='text-head'>BHK:</span>  {docs.category}
                </span><br />
                <span>
                    <span className='text-head'>Posted on:</span>  {docs.createdAt.toDate().toDateString()}
                </span>
                <span >
                    <span className='text-head'>Available From:</span>  {docs.dueDate.toDate().toDateString()}
                </span>
                <span className="save-tag" >
                        {tag ? 
                        <span className='unsave' onClick={() => handleUnsave()}><BsFillBookmarkFill/></span> : 
                        <span className='save' onClick={() => handleSave()}><BsBookmark/></span> }                
                </span>
            </div>

        </div>
            )
}

export default Posts
