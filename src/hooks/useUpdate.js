import { useState } from "react"
import { useAuthContext } from '../hooks/useAuthContext'
import { storage } from '../firebase/config'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { updateProfile, updateEmail } from "firebase/auth";
import { useFirestore } from '../hooks/useFirestore'
import { ImageSharp } from "@mui/icons-material";

export const useUpdate = () => {
    const { updateDocument,response } = useFirestore(['users'])
    const { user } = useAuthContext()   
    const [err, setErr] = useState(null)
    
    const UpdateEmail = async (email) => {
        try {
            if(email !== undefined && email !== null && email !== '\n' && email !== user.email ) {
                await updateEmail(user, `${email}`)
            }      
        } catch (err) {
            setErr(err.message)
            console.log(err)
        }
    }
    
    const UpdateDisplayName = async (name) => {
        try {
            await updateProfile(user,{
                displayName: name,
            })  
        } catch (err) {
            setErr(err.message)
            console.log(err)
        }
    }
    
    const UpdateImg = async (profilePic) => {
        try {
            let imgUrl = user.photoURL
            if(profilePic)
            {
                const uploadPath = `profilePics/${user.uid}/${profilePic.name}`
                const storageRef = ref(storage, uploadPath)
                        await uploadBytes(storageRef, profilePic)
                        const imgUrl = await getDownloadURL(storageRef)
                        let image = imgUrl
                        console.log(image,'or',imgUrl)
                        await updateProfile(user,{
                            photoURL: image,
                        })
                        await updateDocument(user.uid, {
                                photoURL: image
                            })    
                    }
            
        } catch (err) {
            setErr(err.message)
            console.log(err)
        }

    }

    return {UpdateEmail, UpdateDisplayName, UpdateImg, err}
}