import { useState, useEffect } from 'react'
import { updateDoc,doc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import {  signInWithEmailAndPassword } from "firebase/auth"

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()
  
  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
    
    try {
      // login
      const res = await signInWithEmailAndPassword(auth, email, password)
      
      console.log('user-auth-main',user)
      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })
      
      await updateDoc(doc(db, 'users', `${res.user.uid}`), { online: true })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}