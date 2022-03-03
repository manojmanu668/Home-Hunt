import React from 'react'
import { useParams } from 'react-router-dom'
import  Posts from './Posts'
import { useCollection } from '../hooks/useCollection'

function Saved() {
    const { id } = useParams()
    const { documents, error } = useCollection(['users',`${id}`, 'saved'],'',['createdAt', 'desc'])
    // console.log('saved posts',documents)
    
    return (
        <div>
            <div className="post-container">
            {documents && documents.length > 0 ? 
             documents.map(doc => (
                 doc.isActive &&
                    <div key={doc.id}>   
                        <Posts docs={doc}/> 
                    </div>
            ))
            : <div className="not-saved" >Nothing saved yet...</div>}
             {error && <div className="error">{error}</div> } 
            </div>
        </div>
    )
}

export default Saved
