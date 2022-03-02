import { useCollection } from "../hooks/useCollection"
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from "../firebase/config" 

export const useDeletePost = ( docs) => {
    const { documents, error} = useCollection(['posts',`${docs}`,'saved'],'','')
    // const { deleteDocument } = useFirestore(['users' , `${user.uid}`,'saved'])

    
    const deletePost = async () => {
        documents && documents.map(data =>  dpost(data.id))
    }

    const dpost = async (data) => {
        console.log('dpost called')
        await deleteDoc(doc(db,'users' , `${data}`,'saved' , docs))
    }

    return { deletePost }
}