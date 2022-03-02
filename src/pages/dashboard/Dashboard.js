import React from 'react'
import Posts from '../../components/Posts'
import { useCollection } from '../../hooks/useCollection'

function Dashboard() {
    const { documents, error } = useCollection(['posts'],'',['createdAt', 'desc'])
console.log(documents)
    return (
        <div className="post-container">
            {documents ? documents.map(doc => (
                doc.isActive &&
                <div key={doc.id}>
                    <Posts docs={doc}/> 
                </div>
            ))
                :   <div className='not-saved'>No Posts uploaded yet</div>
            }

            {error && <div className="error">{error}</div> }
        </div>
    )
}

export default Dashboard
