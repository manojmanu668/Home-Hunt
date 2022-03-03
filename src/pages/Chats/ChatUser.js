import React,{useState} from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import { Link } from 'react-router-dom'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { HiDotsHorizontal } from 'react-icons/hi';
import { useCollection } from '../../hooks/useCollection';
import { useEffect } from 'react'

function ChatUser () {
    const { id } = useParams()
    const { user } = useAuthContext()
    const { document } = useDocument('users',id)
    const [message, setMessage] = useState('');
    const [isPending, setIsPending ] = useState(false)
    const [err, setErr] = useState(null)
    const {  addDocument, response } = useFirestore(['messages'])
    const [docs, setDocs] = useState(null)
    const { documents, error } = useCollection(['messages'],[`sender`,'in',[`${user.uid}`,`${id}`]],['createdAt'])

        // console.log('msgs',documents)

        const handleSubmit = async () => {
            setIsPending(true)
            const msgObj = {
                sender: user.uid,
                receiver: document.id,
                message
            }
            
            if(message !== "" && document){
                try {
                    await addDocument(msgObj)
                } catch (error) {
                    setErr(error.message)
                    console.log(error.message)  
                }
            }
            if(response.error){
                setErr(response.error)
              }
            setMessage('')
            setIsPending(false)
        }

        const handleKeypress = (e) => {
            // console.log('called',e)
          if (e.key === 'Enter') {
            handleSubmit();
          }
        };
    
    return (
        <div className="msg-wrapper">
            {document ? <>
                    <div className='chat-header'>
                        <Link to={`/profile/${document.id}`}>
                            {document.online && <span className='online-user'></span> }
                            <div className='avatar'>
                                <img src={document.photoURL ? document.photoURL : "/default_user.jpg"} alt="user avatar"/>
                            </div>
                            <span className="cname">{document.displayName}</span>
                        </Link>
                    </div>
                    {err && <div className="error">Couldn't send the message</div> }
                    <div className="msg-container">
                        {documents && documents.map((msg) => (
                            <div className="msgs" style={{ textAlign: msg.sender == user.uid ? 'right' : 'left' }}>
                                <p className='msg-context'>{msg.message}</p>
                            </div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input type="text" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder='Type Something...... '
                                onKeyPress={handleKeypress}
                            />
                        {!isPending && <button onClick={handleSubmit}>Send</button>}
                        {isPending && <button disabled><HiDotsHorizontal/></button>}
                    </div>
                </>: '' }    
        </div>
    )
}

export default ChatUser
