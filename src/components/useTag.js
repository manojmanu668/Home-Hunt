import React,{useState} from 'react'
import { setDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from "../firebase/config" 
import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore'
import { useCollection } from '../hooks/useCollection'

export const useTag = (docs) => {
    const { user } = useAuthContext()
    const uid = user.uid
    const  id  = docs.id;
    const { deleteDocument } = useFirestore(['posts' , `${id}`,'saved'])

    const [err, setErr] = useState(null)

    const handleSave = async () => {
        try {
            const res = await setDoc(doc(db, 'posts' , `${id}`,'saved',`${user.uid}`),{
                userId: user.uid,
            })  

            const resp = await setDoc(doc(db, 'users' , `${uid}`,'saved',`${docs.id}`),{
                ...docs,
            })

        } catch (error) {
            setErr(error.message)
            console.log(error.message)
        }
        if(!err ){
            alert('Saved successfully')
          }
    }

    const handleUnsave = async () => {
        try {
            const res =  await deleteDocument(uid) 
            const ref = doc(db,'users' , `${uid}`,'saved' , id)
            await deleteDoc(ref)
        } catch (error) {
            setErr(error.message)
            console.log(error.message)
        }
        if(!err){
            alert('Unsaved successfully')         
        }
        
    }
    
    // const handleDeleteInUser = async () => {
    //     const { deleteDocument } = useFirestore(['users' , `${uid}`,'saved'])
    //     await deleteDocument(docs.id)
        
    // } 
    return {handleSave, handleUnsave, err}
}

