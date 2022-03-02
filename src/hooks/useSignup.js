import { useState } from "react";

import { setDoc } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { db,auth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuthContext } from '../hooks/useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()


    const signup = async (email, password, displayName) => {
        setError(null)
        setIsPending(true)
        try {
            const res =await createUserWithEmailAndPassword(auth, email, password)
            
            if (!res) {
                throw new Error('Could not complete signup')
            }

            await updateProfile(res.user, { displayName })

            await setDoc(doc(db, 'users' , `${res.user.uid}`), {
                 online: true,
                 displayName,
            });

            dispatch({ type: 'LOGIN', payload: res.user })
        
            setIsPending(false)
            
        } catch (err) {
            setError(err.message)
            setIsPending(false)
        }
    } 

    return { error, isPending, signup}
} 